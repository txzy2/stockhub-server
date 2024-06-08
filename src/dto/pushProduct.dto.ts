import {ApiProperty} from '@nestjs/swagger'

class PriceRange {
  @ApiProperty()
  from: string

  @ApiProperty()
  to: string
}

export class ProductRequestDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  size: string[]

  @ApiProperty()
  brand: string

  @ApiProperty()
  model: string

  @ApiProperty()
  color: string[]

  @ApiProperty()
  material: string[]

  @ApiProperty()
  priceRange: PriceRange

  @ApiProperty()
  var: string
}

export class ProductResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  article: string

  @ApiProperty()
  brand: string

  @ApiProperty()
  material: string

  @ApiProperty()
  model: string

  @ApiProperty()
  color: string[]

  @ApiProperty()
  size: string[]

  @ApiProperty()
  price: string[]

  @ApiProperty()
  photos: string[]

  @ApiProperty()
  var: string
}

export class ProductAddDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  brand: string

  @ApiProperty()
  material: string

  @ApiProperty()
  model: string

  @ApiProperty()
  color: string[]

  @ApiProperty()
  article: string

  @ApiProperty()
  size: string[]

  @ApiProperty()
  price: string[]

  @ApiProperty()
  photos: string[]

  @ApiProperty()
  var: string
}

export class getAllDto {
  @ApiProperty()
  var: string
}
