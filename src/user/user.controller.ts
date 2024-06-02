import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {UserService} from './user.service'
import {
  AddAddressDto,
  AddDto,
  AddEmailDto,
  AddFIODto,
  AddRequsetOrderDto,
} from '../dto/user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('add')
  async adduser(@Body() dto: AddDto) {
    return this.userService.addUser(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('get')
  async getUser(@Body() dto: AddDto) {
    if (!dto.chat_id) {
      throw new BadRequestException('Не указан chat_id')
    }

    return this.userService.getUser(dto.chat_id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('addEmail')
  async addEmail(@Body() dto: AddEmailDto) {
    if (!dto.chat_id || !dto.email) {
      throw new BadRequestException('Не указан chat_id или email')
    }

    return this.userService.add_email(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('addName')
  async addFio(@Body() dto: AddFIODto) {
    if (!dto.chat_id || !dto.fio) {
      throw new BadRequestException('Не указан chat_id или fio')
    }

    return this.userService.add_name(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('addAddres')
  async addAddres(@Body() dto: AddAddressDto) {
    if (!dto.chat_id || !dto.adress) {
      throw new BadRequestException('Не указан chat_id или адресс')
    }

    return this.userService.add_addres(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('addOrder')
  async addOrder(@Body() dto: AddRequsetOrderDto): Promise<string> {
    console.log(dto)
    return this.userService.addOrder(dto)
  }
}
