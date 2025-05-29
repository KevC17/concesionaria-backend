import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, BadRequestException, NotFoundException,
  UseInterceptors, UploadedFile,
  InternalServerErrorException
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Sale } from './sale.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }

  @Post()
  async create(@Body() dto: CreateSaleDto) {
    const sale = await this.salesService.create(dto);
    return new SuccessResponseDto('Sale created successfully', sale);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('isActive') isActive?: string,
  ): Promise<SuccessResponseDto<Pagination<Sale>>> {
    if (isActive !== undefined && isActive !== 'true' && isActive !== 'false') {
      throw new BadRequestException('Invalid value for "isActive". Use "true" or "false".');
    }
    const result = await this.salesService.findAll({ page, limit }, isActive === 'true');
    if (!result) throw new InternalServerErrorException('Could not retrieve sales.');

    return new SuccessResponseDto('Sales retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sale = await this.salesService.findOne(id);
    if (!sale) throw new NotFoundException('Sale not found');
    return new SuccessResponseDto('Sale retrieved successfully', sale);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSaleDto) {
    const sale = await this.salesService.update(id, dto);
    if (!sale) throw new NotFoundException('Sale not found');
    return new SuccessResponseDto('Sale updated successfully', sale);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const sale = await this.salesService.remove(id);
    if (!sale) throw new NotFoundException('Sale not found');
    return new SuccessResponseDto('Sale deleted successfully', sale);
  }
}
