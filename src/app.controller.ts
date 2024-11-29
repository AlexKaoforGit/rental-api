import { Controller, Post, Patch, Get, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 租借車輛
   * @param userId 使用者 ID
   * @param licensePlate 車牌號碼
   * @returns 租借成功的詳細資訊
   */
  @Post('rent')
  async rentScooter(
    @Body() { userId, licensePlate }: { userId: number; licensePlate: string },
  ) {
    return await this.appService.rentScooter(userId, licensePlate);
  }

  /**
   * 刪除租借紀錄
   * @param rentId 租借紀錄 ID
   * @returns 刪除成功的訊息
   */
  @Delete('rent/:id')
  async deleteRental(@Param('id') rentId: number) {
    return await this.appService.deleteRental(rentId);
  }

  /**
   * 獲取所有租借紀錄
   * @returns 所有租借紀錄的清單
   */
  @Get('rentals')
  async getAllRentals() {
    return await this.appService.getAllRentals();
  }

  /**
   * 歸還車輛
   * @param rentId 租借紀錄 ID
   * @returns 歸還後更新的租借資訊
   */
  @Patch('return/:id')
  async returnScooter(@Param('id') rentId: number) {
    return await this.appService.returnScooter(rentId);
  }

  /**
   * 獲取所有未歸還的租借紀錄
   * @returns 所有正在進行的租借紀錄
   */
  @Get('active-rentals')
  async getActiveRentals() {
    return await this.appService.getActiveRentals();
  }

  /**
   * 獲取所有使用者資訊
   * @returns 使用者清單及其租借資訊
   */
  @Get('users')
  async getAllUsers() {
    return await this.appService.getAllUsers();
  }

  /**
   * 新增使用者
   * @param name 使用者名稱
   * @param email 使用者 Email
   * @returns 新增成功的使用者詳細資訊
   */
  @Post('users')
  async addUser(@Body() { name, email }: { name: string; email: string }) {
    return await this.appService.addUser(name, email);
  }

  /**
   * 新增車輛
   * @param model 車輛型號
   * @param licensePlate 車牌號碼
   * @returns 新增成功的車輛詳細資訊
   */
  @Post('scooters')
  async addScooter(@Body() { model, licensePlate }: { model: string; licensePlate: string }) {
    return await this.appService.addScooter(model, licensePlate);
  }

  /**
   * 獲取所有車輛資訊
   * @returns 車輛清單及其狀態
   */
  @Get('scooters')
  async getAllScooters() {
    return await this.appService.getAllScooters();
  }
}