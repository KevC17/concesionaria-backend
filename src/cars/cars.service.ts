import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Car } from './car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
  ) {}

  async create(dto: CreateCarDto): Promise<Car | null> {
    try {
      const car = this.carRepo.create(dto);
      return await this.carRepo.save(car);
    } catch (err) {
      console.error('Error creating car:', err);
      return null;
    }
  }

  async findAll(options: IPaginationOptions, isActive?: boolean): Promise<Pagination<Car> | null> {
    try {
      const query = this.carRepo.createQueryBuilder('car');
      if (isActive !== undefined) {
        query.where('car.isActive = :isActive', { isActive });
      }
      return await paginate<Car>(query, options);
    } catch (err) {
      console.error('Error retrieving cars:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Car | null> {
    try {
      return await this.carRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error finding car:', err);
      return null;
    }
  }

  async findByName(name: string): Promise<Car | null> {
    try {
      return await this.carRepo.findOne({ where: { name } });
    } catch (err) {
      console.error('Error finding car by name:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateCarDto): Promise<Car | null> {
    try {
      const car = await this.findOne(id);
      if (!car) return null;

      Object.assign(car, dto);
      return await this.carRepo.save(car);
    } catch (err) {
      console.error('Error updating car:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Car | null> {
    try {
      const car = await this.findOne(id);
      if (!car) return null;

      return await this.carRepo.remove(car);
    } catch (err) {
      console.error('Error deleting car:', err);
      return null;
    }
  }

  async updateImage(id: string, filename: string): Promise<Car | null> {
    try {
      const car = await this.findOne(id);
      if (!car) return null;

      car.image = filename;
      return await this.carRepo.save(car);
    } catch (err) {
      console.error('Error updating car image:', err);
      return null;
    }
  }
}
