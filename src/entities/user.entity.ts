import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rent } from './rent.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true }) // 確保 email 是唯一的
  email: string;

  @OneToMany(() => Rent, (rent) => rent.user)
  rents: Rent[];
}