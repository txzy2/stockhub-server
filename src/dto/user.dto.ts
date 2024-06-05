import {IsEmail, IsNotEmpty, IsString} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class AddDto {
  @ApiProperty()
  chat_id: string

  @ApiProperty()
  username: string

  @ApiProperty()
  email: string

  @ApiProperty()
  fio: string

  @ApiProperty()
  locale: string

  @ApiProperty()
  count: number

  @ApiProperty()
  bounus: number

  @ApiProperty()
  orders: number
}

export class AddEmailDto {
  @ApiProperty()
  chat_id: string

  @ApiProperty()
  @IsEmail()
  email: string
}

export class AddFIODto {
  @ApiProperty()
  chat_id: string

  @ApiProperty()
  fio: string
}

export class AddAddressDto {
  @ApiProperty()
  chat_id: string

  @ApiProperty()
  adress: string
}

export class AddRequsetOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  amount: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transactionTitle: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  chat_id: string

  @ApiProperty()
  @IsString()
  article?: string

  @ApiProperty()
  @IsString()
  size: string
}

export class AddResponseOrderDto {
  @ApiProperty()
  transactionLink: string
}

export class DelBasketItemDto {
  @ApiProperty()
  @IsString()
  size: string

  @ApiProperty()
  @IsString()
  chat_id: string
}

export class addBasketItemDto {
  @ApiProperty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsString()
  size: string

  @ApiProperty()
  @IsString()
  article: string
}
