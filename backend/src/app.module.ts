import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', 
      port: 3306,
      username: 'root',      
      password: 'B3tt3g4', 
      database: 'catalogo',
      autoLoadEntities: true,
      synchronize: false,
    }),
    ProductsModule,
  ],
})
export class AppModule {}
