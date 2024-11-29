import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Scooter } from './scooter.entity';

@Entity()
export class Rent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rents)
  user: User;

  @ManyToOne(() => Scooter, (scooter) => scooter.rents)
  scooter: Scooter;

  @CreateDateColumn()
  startTime: Date;

  @UpdateDateColumn({ nullable: true })
  endTime: Date | null;
}