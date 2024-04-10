import {
  Body,
  Controller,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Post,
} from '@nestjs/common'
import {PhotoService} from './photo.service'
import {PushPhotoDto} from 'src/dto/pushPhoto.dto'

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('get')
  async pushphoto(@Body() dto: PushPhotoDto) {
    return this.photoService.pushPhoto(dto)
  }
}
