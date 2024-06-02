import {
  Body,
  Controller,
  Get,
  HttpCode,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {ProductService} from './product.service'
import {
  ProductRequestDto,
  ProductResponseDto,
  getAllDto,
  ProductAddDto,
} from 'src/dto/pushProduct.dto'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get('get')
  async getProduct(
    @Query() shoe: ProductRequestDto,
  ): Promise<ProductResponseDto[]> {
    console.log('Received request:', shoe)
    return await this.productService.pushProductByParams(shoe)
  }

  @Get('getAll')
  async getAll(@Body() dto: getAllDto) {
    return await this.productService.pushAll(dto)
  }

  // @Post('add')
  // async addProduct(@Body() dto: ProductAddDto): boolean {
  //   const res = await this.productService.addProduct(dto)
  // }
}
