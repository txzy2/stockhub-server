import {BadRequestException, Injectable} from '@nestjs/common'
import {
  ProductRequestDto,
  ProductResponseDto,
  PushPhotoDto,
} from 'src/dto/pushPhoto.dto'
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

  async pushPhotoByParams(
    dto: ProductRequestDto,
  ): Promise<ProductResponseDto[]> {
    const where: any = {}

    if (dto.name) {
      where.name = dto.name
    }

    if (dto.size && dto.size.length > 0) {
      where.size = {
        hasSome: dto.size,
      }
    }

    if (dto.brand) {
      where.brand = dto.brand
    }

    if (dto.color) {
      where.color = dto.color
    }

    if (dto.material) {
      where.material = dto.material
    }

    const products: ProductResponseDto[] = await this.prisma.product.findMany({
      where,
    })

    return products
  }
}
