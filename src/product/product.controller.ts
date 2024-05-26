import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ProductService } from './product.service'
import {
  ProductRequestDto,
  ProductResponseDto,
  getAllDto, ProductAddDto,
} from 'src/dto/pushProduct.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('get')
  async getProduct(
    @Body() shoe: ProductRequestDto,
  ): Promise<ProductResponseDto[]> {
    console.log('Received request:', shoe)
    const products = await this.productService.pushProductByParams(shoe)
    return products
  }

  @Post('getAll')
  async getAll(@Body() dto: getAllDto) {
    return await this.productService.pushAll(dto)
  }

  @Post('add')
  async addProduct(@Body() dto: ProductAddDto): boolean {
    const res = await this.productService.addProduct(dto)
  }
}
