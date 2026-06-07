import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CouponsService {

  constructor(
    @InjectRepository(Coupon) private couponsRepository: Repository<Coupon>
  ) { }


  create(createCouponDto: CreateCouponDto) {
    return this.couponsRepository.save(createCouponDto);
  }

  findAll() {
    return this.couponsRepository.find();
  }

  async findOne(id: number) {
    const coupon = await this.couponsRepository.findOneBy({ id });
    if (!coupon) {
      throw new Error(`Coupon with ID ${id} not found`);
    }
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(id);
    Object.assign(coupon, updateCouponDto);
    return this.couponsRepository.save(coupon);
  }

  async remove(id: number) {
    const coupon = await this.findOne(id);
    return this.couponsRepository.remove(coupon);
  }

  async applyCoupon(name: string) {
    const coupon = await this.couponsRepository.findOneBy({ name });
    if (!coupon) {
      throw new Error(`Coupon with name ${name} not found`);
    }

    const currentDate = new Date();
    const expirationDate = endOfDay(coupon.expirationDate);
    if (isAfter(currentDate, expirationDate)) {
      throw new UnprocessableEntityException(`Coupon with name ${name} has expired`);
    }

    return {
      message: `Coupon applied successfully! You get a ${coupon.percentage}% discount.`,
      coupon
    }
  }
}
