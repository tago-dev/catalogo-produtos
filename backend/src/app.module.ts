import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
// using process.env directly to avoid extra peer-dependency on @nestjs/config

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'B3tt3g4',
      database: process.env.DB_NAME || 'catalogo',
      autoLoadEntities: true,
      synchronize:
        process.env.TYPEORM_SYNC === 'true' || process.env.NODE_ENV === 'test',
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
