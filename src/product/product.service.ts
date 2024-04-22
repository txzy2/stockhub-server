import {Injectable} from '@nestjs/common'
import {ProductRequestDto, ProductResponseDto} from 'src/dto/pushProduct.dto'
import {PrismaService} from 'src/prisma.service'

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async pushPhotoByParams(
    dto: ProductRequestDto,
  ): Promise<ProductResponseDto[]> {
    const where: any = {}

    if (dto.name) {
      where.name = dto.name
    }

    if (dto.model) {
      where.model = dto.model
    }

    if (dto.size && dto.size.length > 0) {
      where.variants = {
        some: {
          size: {
            has: dto.size,
          },
        },
      }
    }

    if (dto.color && dto.color.length > 0) {
      where.variants = {
        some: {
          color: {
            equals: dto.color,
          },
        },
      }
    }

    if (dto.brand) {
      where.brand = {
        in: [dto.brand],
      }
    }

    if (dto.material && dto.material.length > 0) {
      where.material = {
        equals: dto.material,
      }
    }

    const products = await this.prisma.product.findMany({
      where,
      include: {
        variants: {
          select: {
            color: true,
            size: true,
          },
        },
      },
    })

    const response: ProductResponseDto[] = products
      .filter(product => product.variants.length > 0)
      .map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        material: product.material,
        model: product.model,
        color: product.variants.map(variant => variant.color),
        size: product.variants.flatMap(variant => variant.size),
        photos: product.photos,
      }))

    return response
  }
}
