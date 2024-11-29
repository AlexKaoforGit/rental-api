import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rent } from './entities/rent.entity';
import { User } from './entities/user.entity';
import { Scooter } from './entities/scooter.entity';
import { convertToTaipeiTime } from './utilities/dateUtils';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Rent) private rentRepository: Repository<Rent>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Scooter) private scooterRepository: Repository<Scooter>,
  ) {}

  async rentScooter(userId: number, licensePlate: string): Promise<Rent> {
    // 檢查使用者是否已經租借車輛
    const activeRentals = await this.getActiveRentals(); // 使用 getActiveRentals 方法
    const userHasActiveRental = activeRentals.some(rental => rental.user.id === userId);

    if (userHasActiveRental) {
        throw new BadRequestException('User already has an active rental.');
    }

    // 檢查車輛是否被租借
    const scooter = await this.scooterRepository.findOne({
        where: { licensePlate },
    });
    if (!scooter) {
        throw new BadRequestException('Scooter not found.');
    }
    if (!scooter.isAvailable) {
        throw new BadRequestException('Scooter is already rented.');
    }

    // 查找使用者
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['rents'], // 加載 rents 關聯
    });
    if (!user) {
        throw new BadRequestException('User not found.');
    }

    // 更新車輛狀態為不可用
    scooter.isAvailable = false;
    await this.scooterRepository.save(scooter);

    const utcDate = new Date(); // UTC 時間
    const taipeiTime = convertToTaipeiTime(utcDate);

    // 創建租借紀錄
    const rent = this.rentRepository.create({
        user,
        scooter,
        startTime: taipeiTime,
        endTime: null, // 設定租借尚未結束
    });

    const savedRent = await this.rentRepository.save(rent);

    // 將租借 id 添加到使用者的 rents 中
    user.rents.push(savedRent); // 更新 rents
    await this.userRepository.save(user); // 保存使用者，更新 rents 關聯

    return savedRent;
  }

  async deleteRental(rentId: number): Promise<{ message: string }> {
    const rental = await this.rentRepository.findOneBy({ id: rentId });
  
    if (!rental) {
      throw new Error(`Rental with ID ${rentId} not found.`);
    }
  
    await this.rentRepository.remove(rental);
    return { message: `Rental with ID ${rentId} has been deleted.` };
  }

  async getAllRentals(): Promise<Rent[]> {
    return this.rentRepository.find({
      relations: ['user', 'scooter'], // 加入關聯，方便查看完整資料
    });
  }

  async returnScooter(rentId: number): Promise<Rent> {
    // 找到對應的租借記錄
    const rent = await this.rentRepository.findOne({
      where: { id: rentId },
      relations: ['scooter'], // 確保包含關聯的 scooter 資料
    });

    // 驗證租借記錄是否存在且未結束
    if (!rent || rent.endTime) {
      throw new BadRequestException('Invalid or already completed rental.');
    }

    const utcDate = new Date(); // UTC 時間
    const taipeiTime = convertToTaipeiTime(utcDate);

    // 更新租借記錄的結束時間
    rent.endTime = taipeiTime;

    // 更新車輛的狀態為可用
    const scooter = rent.scooter;
    if (scooter) {
      scooter.isAvailable = true;
      await this.scooterRepository.save(scooter); // 保存車輛狀態
    }

    // 保存並返回更新後的租借記錄
    return this.rentRepository.save(rent);
  }

  async getActiveRentals(): Promise<Rent[]> {
    const rentals = await this.rentRepository
      .createQueryBuilder('rent')
      .leftJoinAndSelect('rent.user', 'user')
      .leftJoinAndSelect('rent.scooter', 'scooter')
      .where('rent.endTime IS NULL')
      .getMany();

    return rentals;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['rents'], // 明確載入 rents 關聯
    });
  }

  async addUser(name: string, email: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email }, // 改用 findOne 並指定 where 條件
    });
  
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }
  
    const user = this.userRepository.create({ name, email });
    return this.userRepository.save(user);
  }

  async addScooter(model: string, licensePlate: string): Promise<Scooter> {
    // 檢查是否有相同車牌的車輛
    const existingScooter = await this.scooterRepository.findOne({
      where: { licensePlate },
    });
  
    if (existingScooter) {
      throw new BadRequestException('Scooter with this license plate already exists.');
    }

    // 創建新的車輛
    const scooter = this.scooterRepository.create({ model, licensePlate });
    return this.scooterRepository.save(scooter);
  }

  async getAllScooters(): Promise<Scooter[]> {
    return this.scooterRepository.find();
  }
}