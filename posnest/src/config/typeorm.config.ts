import { ConfigService } from "@nestjs/config"
import type { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { join } from "path"

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: "postgres",
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    ssl: false,
    logging: true,

    entities: [join(__dirname + '../../**/*.entity.{ts,js}')],
    synchronize: true,

})