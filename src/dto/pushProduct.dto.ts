export type ProductRequestDto = {
  name: string
  size: string[]
  brand: string
  model: string
  color: string[]
  material: string[]
  price: string[]
  var: string
}

export type ProductResponseDto = {
  id: number
  name: string
  brand: string
  material: string
  model: string
  color: string[]
  article: string
  size: string[]
  price: string[]
  photos: string[]
  var: string
}

export class ProductAddDto {
  name: string
  brand: string
  material: string
  model: string
  color: string[]
  article: string
  size: string[]
  price: string[]
  photos: string[]
  var: string
}

export type getAllDto = {
  var: string
}
