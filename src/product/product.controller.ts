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
@UsePipes(new ValidationPipe())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(200)
  @Get('get')
  async getProduct(
    @Query() shoe: ProductRequestDto,
  ): Promise<ProductResponseDto[]> {
    console.log('Received request:', shoe)
    return await this.productService.pushProductByParams(shoe)
  }

  @HttpCode(200)
  @Get('getAll')
  async getAll(@Body() dto: getAllDto) {
    return await this.productService.pushAll(dto)
  }

  // @HttpCode(200)
  // @Post('add')
  // async addProduct(@Body() dto: ProductAddDto): boolean {
  //   const res = await this.productService.addProduct(dto)
  // }
}
