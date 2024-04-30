export type ProductRequestDto = {
  name: string
  size: string[]
  brand: string
  model: string
  color: string[]
  material: string[]
  price: string
}

export type ProductResponseDto = {
  id: number
  name: string
  brand: string
  material: string
  model: string
  color: string[]
  size: string[]
  price: string
  photos: string[]
}

export type getAllDto = {
  var: string
}
