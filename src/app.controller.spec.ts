import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should create a new rental', () => {
    const rental = appController.rentScooter({ userId: 1, licensePlate: 'TEST-1234' });
    expect(rental).toHaveProperty('id');
  });

  it('should return an error if the user already has an active rental', () => {
    appController.rentScooter({ userId: 1, licensePlate: 'TEST-1234' });
    expect(() => appController.rentScooter({ userId: 1, licensePlate: 'TEST-1234' })).toThrow();
  });

  it('should return all active rentals', async () => {
    appController.rentScooter({ userId: 1, licensePlate: 'TEST-1234' });
    const activeRentals = appController.getActiveRentals();
    expect((await activeRentals).length).toBe(1);
  });

  it('should return a scooter', async () => {
    const rental = await appController.rentScooter({ userId: 1, licensePlate: 'TEST-1234' });
    const returnedRental = await appController.returnScooter(rental.id);
    expect(returnedRental.endTime).not.toBeNull();
  });
});