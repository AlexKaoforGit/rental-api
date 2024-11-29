import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Scooter } from './entities/scooter.entity';
import { Rent } from './entities/rent.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'rental.db', // 使用 SQLite 資料庫
      entities: [User, Scooter, Rent],
      synchronize: true, // 開發時自動同步表結構
    }),
    TypeOrmModule.forFeature([User, Scooter, Rent]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}