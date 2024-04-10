import {BadRequestException, Injectable} from '@nestjs/common'
import {AddDto} from '../dto/add.dto'
import {PrismaService} from 'src/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async addUser(dto: AddDto) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        chat_id: dto.chat_id,
      },
    })

    console.log(existUser)
    if (existUser) throw new BadRequestException('User already exist')

    const user = await this.prisma.user.create({
      data: {
        chat_id: dto.chat_id,
        username: dto.username,
      },
    })

    const ordersCount = await this.prisma.userOrders.count({
      where: {
        userId: user.id,
      },
    })

    const userWithOrdersCount = {
      ...user,
      ordersCount: ordersCount,
    }

    console.log(userWithOrdersCount)
    return userWithOrdersCount
  }

  async getUser(chat_id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        chat_id: chat_id,
      },
      include: {
        orders: true,
      },
    })

    if (!user) {
      throw new BadRequestException(`Пользователь с ${chat_id} не найден`)
    }

    let ordersCount = 0
    if (user.id) {
      ordersCount = await this.prisma.userOrders.count({
        where: {
          userId: user.id,
        },
      })
    }
    console.log(user)

    return {
      locale: user.locale,
      email: user.email,
      fio: user.fio,
      bonus: user.bonus,
      orders: ordersCount,
    }
  }
}
