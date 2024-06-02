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
  bounus: number

  @ApiProperty()
  orders: number
}

export class AddEmailDto {
  @ApiProperty()
  chat_id: number

  @ApiProperty()
  @IsEmail()
  email: string
}

export class AddFIODto {
  @ApiProperty()
  chat_id: number

  @ApiProperty()
  fio: string
}

export class AddAddressDto {
  @ApiProperty()
  chat_id: number

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
  transactionLink: string
}
