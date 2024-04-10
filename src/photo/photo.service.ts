import {BadRequestException, Injectable} from '@nestjs/common'
import {PushPhotoDto} from 'src/dto/pushPhoto.dto'
import {PrismaService} from 'src/prisma.service'

@Injectable()
export class PhotoService {
  constructor(private prisma: PrismaService) {}

  async pushPhoto(dto: PushPhotoDto) {
    const photoFromDB = await this.prisma.staticPhoto.findFirst({
      where: {
        name: dto.name,
      },
    })

    if (!photoFromDB) {
      throw new BadRequestException(`Фото с именем ${dto.name} не найдено`)
    }

    const response = {
      caption: photoFromDB.caption,
      photo: photoFromDB.photo,
    }

    return response
  }
}
