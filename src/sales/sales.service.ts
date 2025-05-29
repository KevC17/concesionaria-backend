import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Sale } from './sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Car } from '../cars/car.entity';
import { User } from '../users/user.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepo: Repository<Sale>,

    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateSaleDto): Promise<Sale | null> {
    try {
      const car = await this.carRepo.findOneBy({ id: dto.car });
      const user = await this.userRepo.findOneBy({ id: dto.user });

      if (!car || !user) {
        console.error('Car or User not found');
        return null;
      }
      const sale = this.saleRepo.create({ car, user });
      return await this.saleRepo.save(sale);
    } catch (err) {
      console.error('Error creating sale:', err);
      return null;
    }
  }

  async findAll(options: IPaginationOptions, isActive?: boolean): Promise<Pagination<Sale> | null> {
    try {
      const query = this.saleRepo.createQueryBuilder('sale');
      if (isActive !== undefined) {
        query.where('sale.isActive = :isActive', { isActive });
      }
      return await paginate<Sale>(query, options);
    } catch (err) {
      console.error('Error retrieving sales:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Sale | null> {
    try {
      return await this.saleRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error finding sale:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateSaleDto): Promise<Sale | null> {
    try {
      const sale = await this.findOne(id);
      if (!sale) return null;

      Object.assign(sale, dto);
      return await this.saleRepo.save(sale);
    } catch (err) {
      console.error('Error updating sale:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Sale | null> {
    try {
      const sale = await this.findOne(id);
      if (!sale) return null;

      return await this.saleRepo.remove(sale);
    } catch (err) {
      console.error('Error deleting sale:', err);
      return null;
    }
  }
}
