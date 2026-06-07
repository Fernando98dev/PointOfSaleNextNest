import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';

async function main() {
    const app = await NestFactory.create(SeederModule);
    const seeder = app.get(SeederService);
    await seeder.seed();
    app.close();
}
main();