import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContent } from './entities/transaction.entity';
import { Between, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from '../coupons/coupons.service';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContent)
    private readonly transactionContentsRepository: Repository<TransactionContent>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly couponService: CouponsService
  ) { }
  async create(createTransactionDto: CreateTransactionDto) {
    await this.productRepository.manager.transaction(async (transactionalEntityManager) => {
      const transaction = new Transaction();
      const total = createTransactionDto.contents.reduce((sum, content) => sum + content.price * content.quantity, 0);
      transaction.total = total;

      if (createTransactionDto.coupon) {
        const couponResult = await this.couponService.applyCoupon(createTransactionDto.coupon);
        const discount = (total * couponResult.coupon.percentage) / 100;
        transaction.coupon = couponResult.coupon.name;
        transaction.discount = discount;
        transaction.total = total - discount;
      }
      await transactionalEntityManager.save(transaction);

      for (const contents of createTransactionDto.contents) {
        const product = await transactionalEntityManager.findOneBy(Product, { id: contents.productId });

        if (!product) {
          throw new Error(`Product with ID ${contents.productId} not found`);
        }
        if (product.inventory < contents.quantity) {
          throw new Error(`Not enough inventory for product ID ${contents.productId}`);
        }
        product.inventory -= contents.quantity;

        //create an instance of TransactionContent and save it
        const transactionContent = new TransactionContent();
        transactionContent.quantity = contents.quantity;
        transactionContent.price = contents.price;
        transactionContent.transaction = transaction;
        transactionContent.product = product;

        await transactionalEntityManager.save(transactionContent);
      }
    });

    return { message: "Venta almacenada correctamente" }
  }

  findAll(transactionDate?: string) {
    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: true
      }
    };

    if (transactionDate) {
      const date = parseISO(transactionDate);
      if (!isValid(date)) {
        throw new Error('Invalid transaction date');
      }
      const start = startOfDay(date);
      const end = endOfDay(date);
      options.where = {
        ...options.where,
        transactionDate: Between(start, end)
      };
    }
    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: {
        contents: true
      }
    });
    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);

    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    for (const contents of transaction.contents) {
      const product = await this.productRepository.findOneBy({ id: contents.product.id });
      if (product) {
        product.inventory += contents.quantity;
        await this.productRepository.save(product);
      }

      const transactionContent = await this.transactionContentsRepository.findOneBy({ id: contents.id });
      await this.transactionContentsRepository.remove(transactionContent!);
    }
    await this.transactionRepository.remove(transaction);
    return { message: `Transaction with ID ${id} has been removed` };
  }
}
