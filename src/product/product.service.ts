import {Injectable} from '@nestjs/common'
import {
  getAllDto,
  ProductRequestDto,
  ProductResponseDto,
} from 'src/dto/pushProduct.dto'
import {PrismaService} from 'src/prisma.service'

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async pushProductByParams(
    dto: ProductRequestDto,
  ): Promise<ProductResponseDto[]> {
    const where: any = {}

    if (dto.name) {
      where.name = dto.name
    }

    if (dto.var) {
      where.var = dto.var
    }

    if (dto.model) {
      where.model = dto.model
    }

    if (dto.size && dto.size.length > 0) {
      where.ProductVariant = {
        some: {
          size: {
            has: dto.size,
          },
        },
      }
    }

    if (dto.priceRange) {
      where.ProductVariant = {
        some: {
          price: {
            gte: dto.priceRange.from,
            lte: dto.priceRange.to,
          },
        },
      }
    }

    if (dto.color && dto.color.length > 0) {
      where.ProductVariant = {
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
        ProductVariant: {
          select: {
            color: true,
            price: true,
            size: true,
          },
        },
      },
    })

    console.log(products)

    return products
      .filter(product => product.ProductVariant.length > 0)
      .map(product => ({
        id: product.id,
        name: product.name,
        article: product.article,
        brand: product.brand,
        material: product.material,
        model: product.model,
        color: product.ProductVariant.map(variant => variant.color),
        size: product.ProductVariant.flatMap(variant => variant.size),
        price: product.ProductVariant.map(variant => variant.price),
        photos: product.photos,
        var: product.var,
      }))
  }

  async pushAll(dto: getAllDto) {
    return this.prisma.product.findMany({
      where: {var: dto.var},
      include: {
        ProductVariant: {
          select: {
            color: true,
            size: true,
            price: true,
          },
        },
      },
    })
  }

  // async addProduct(dto: ProductAddDto){
  //   await this.prisma.product.create()
  // }
}
