import {Blob} from 'buffer'

export class PushPhotoDto {
  id: number
  name: string
  caption: string
  photo: Buffer
}

export type ProductRequestDto = {
  name: string
  size: string[]
  brand: string
  color: string
  material: string
}

type Photo = {
  id: number
  url: string
}

export type ProductResponseDto = {
  id: number
  name: string
  brand: string
  material: string
  color: string
  size: string[]
  photos: string[]
}
