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
  getAllDto,
} from 'src/dto/pushProduct.dto'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('get')
  async getPhoto(
    @Body() shoe: ProductRequestDto,
  ): Promise<ProductResponseDto[]> {
    console.log('Received request:', shoe)
    const products = await this.productService.pushPhotoByParams(shoe)
    return products
  }

  @Post('getAll')
  async getAll(@Body() dto: getAllDto) {
    return await this.productService.pushAll(dto)
  }
}
