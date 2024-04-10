import {Blob} from 'buffer'

export class PushPhotoDto {
  id: number
  name: string
  caption: string
  photo: Buffer
}
