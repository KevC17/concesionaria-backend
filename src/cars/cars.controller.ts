import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, BadRequestException, NotFoundException,
  UseInterceptors, UploadedFile,
  InternalServerErrorException
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Car } from './car.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) { }

  @Post()
  async create(@Body() dto: CreateCarDto) {
    const car = await this.carsService.create(dto);
    return new SuccessResponseDto('Car created successfully', car);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('isActive') isActive?: string,
  ): Promise<SuccessResponseDto<Pagination<Car>>> {
    if (isActive !== undefined && isActive !== 'true' && isActive !== 'false') {
      throw new BadRequestException('Invalid value for "isActive". Use "true" or "false".');
    }
    const result = await this.carsService.findAll({ page, limit }, isActive === 'true');
    if (!result) throw new InternalServerErrorException('Could not retrieve cars.');

    return new SuccessResponseDto('Cars retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const car = await this.carsService.findOne(id);
    if (!car) throw new NotFoundException('Car not found');
    return new SuccessResponseDto('Car retrieved successfully', car);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    const car = await this.carsService.update(id, dto);
    if (!car) throw new NotFoundException('Car not found');
    return new SuccessResponseDto('Car updated successfully', car);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const car = await this.carsService.remove(id);
    if (!car) throw new NotFoundException('Car not found');
    return new SuccessResponseDto('Car deleted successfully', car);
  }

  @Put(':id/image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/image',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Only JPG or PNG files are allowed'), false);
      }
      cb(null, true);
    }
  }))
  async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Image is required');
    const car = await this.carsService.updateImage(id, file.filename);
    if (!car) throw new NotFoundException('Car not found');
    return new SuccessResponseDto('Image updated', car);
  }
}
