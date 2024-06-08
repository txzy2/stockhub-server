import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {UserService} from './user.service'
import {
  AddAddressDto,
  addBasketItemDto,
  AddDto,
  AddEmailDto,
  AddFIODto,
  AddRequsetOrderDto,
  DelBasketItemDto,
} from '../dto/user.dto'

@Controller('user')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Post('add')
  async adduser(@Body() dto: AddDto) {
    return this.userService.addUser(dto)
  }

  @HttpCode(200)
  @Get('get')
  async getUser(@Query() dto: AddDto) {
    console.log(dto)
    if (!dto.chat_id) {
      throw new BadRequestException('Не указан chat_id')
    }

    return this.userService.getUser(dto.chat_id)
  }

  @HttpCode(200)
  @Post('addEmail')
  async addEmail(@Body() dto: AddEmailDto) {
    if (!dto.chat_id || !dto.email) {
      throw new BadRequestException('Не указан chat_id или email')
    }

    return this.userService.add_email(dto)
  }

  @HttpCode(200)
  @Post('addName')
  async addFio(@Body() dto: AddFIODto) {
    if (!dto.chat_id || !dto.fio) {
      throw new BadRequestException('Не указан chat_id или fio')
    }

    return this.userService.add_name(dto)
  }

  @HttpCode(200)
  @Post('addAddres')
  async addAddres(@Body() dto: AddAddressDto) {
    if (!dto.chat_id || !dto.adress) {
      throw new BadRequestException('Не указан chat_id или адресс')
    }

    return this.userService.add_addres(dto)
  }

  @HttpCode(200)
  @Post('addOrder')
  async addOrder(@Body() dto: AddRequsetOrderDto): Promise<string> {
    console.log(dto)
    return this.userService.addOrder(dto)
  }

  @HttpCode(200)
  @Post('addToBasket')
  async addToBasket(@Body() dto: addBasketItemDto) {
    console.log(dto)
    return this.userService.addItemBasket(dto)
  }

  @HttpCode(200)
  @Delete('delItemBasket')
  async delBasket(@Body() dto: DelBasketItemDto) {
    console.log(dto)
    return this.userService.delItemBasket(dto)
  }

  @HttpCode(200)
  @Get('getCallback')
  async callback(@Query() dto: any) {
    console.log(dto)
    return this.userService.getCallback(dto)
  }
}
