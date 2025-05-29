import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  color: string;

  @Column()
  price: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;
}
