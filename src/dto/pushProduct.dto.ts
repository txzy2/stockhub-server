export type ProductRequestDto = {
  name: string
  size: string[]
  brand: string
  model: string
  color: string[]
  material: string[]
}

export type ProductResponseDto = {
  id: number
  name: string
  brand: string
  material: string
  model: string
  color: string[]
  size: string[]
  photos: string[]
}
