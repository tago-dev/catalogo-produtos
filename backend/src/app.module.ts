import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

// As configurações do banco agora são lidas via variáveis de ambiente com valores
// padrão para facilitar desenvolvimento local. Valores esperados:
//  DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, TYPEORM_SYNC

@Module({
  imports: [
    // Em ambiente de teste usamos um banco em memória (sqlite) para evitar
    // dependência externa do MySQL e timeouts durante os hooks.
    ...(process.env.NODE_ENV === 'test'
      ? [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            autoLoadEntities: true,
            synchronize: true,
          }),
        ]
      : [
          TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: (process.env.TYPEORM_SYNC === 'true') || false,
          }),
        ]),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
