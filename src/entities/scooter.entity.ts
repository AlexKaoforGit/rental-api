import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rent } from './rent.entity';

@Entity()
export class Scooter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column({ unique: true })
  licensePlate: string;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => Rent, (rent) => rent.scooter)
  rents: Rent[];
}