import { IsEmail } from 'class-validator'

export class AddDto {
  chat_id: string
  username: string
  email: string
  fio: string
  locale: string
  bounus: number
  orders: number
}

export class AddEmailDto {
  chat_id: number
  @IsEmail()
  email: string
}

export class AddFIODto {
  chat_id: number
  fio: string
}

export class AddAddressDto {
  chat_id: number
  adress: string
}
