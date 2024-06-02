import {BadRequestException, Injectable} from '@nestjs/common'
import {
  AddAddressDto,
  AddDto,
  AddEmailDto,
  AddFIODto,
  AddRequsetOrderDto,
} from '../dto/add.dto'
import {PrismaService} from 'src/prisma.service'
import {createHash} from 'crypto'
import * as process from 'node:process'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async addUser(dto: AddDto) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        chat_id: dto.chat_id,
      },
    })

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
        basket: true,
      },
    })

    if (!user) {
      throw new BadRequestException(`Пользователь с ${chat_id} не найден`)
    }

    let inBasketCount = 0
    if (user.id) {
      inBasketCount = await this.prisma.userBasket.count({
        where: {
          userId: user.id,
        },
      })
    }
    console.log(user)

    return {
      chat_id: user.chat_id,
      username: user.username,
      locale: user.locale,
      email: user.email,
      fio: user.fio,
      bonus: user.bonus,
      orders: user.count,
      basket: inBasketCount,
    }
  }

  async add_email(dto: AddEmailDto) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        chat_id: dto.chat_id.toString(),
      },
    })

    if (!existUser) throw new BadRequestException('User not found')

    return this.prisma.user.update({
      where: {
        chat_id: dto.chat_id.toString(),
      },
      data: {
        email: dto.email,
      },
    })
  }

  async add_name(dto: AddFIODto) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        chat_id: dto.chat_id.toString(),
      },
    })

    if (!existUser) throw new BadRequestException('User not found')

    return this.prisma.user.update({
      where: {
        chat_id: dto.chat_id.toString(),
      },
      data: {
        fio: dto.fio,
      },
    })
  }

  async add_addres(dto: AddAddressDto) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        chat_id: dto.chat_id.toString(),
      },
    })

    if (!existUser) throw new BadRequestException('User not found')

    return this.prisma.user.update({
      where: {
        chat_id: dto.chat_id.toString(),
      },
      data: {
        locale: dto.adress,
      },
    })
  }

  async addOrder(dto: AddRequsetOrderDto): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        chat_id: dto.chat_id.toString(),
      },
      select: {id: true, email: true},
    })

    if (!user) throw new BadRequestException('User not found')

    const addOrder = await this.prisma.userOrders.create({
      data: {userId: user.id, article: dto.article, status: 'IN_PROGRESS'},
      select: {id: true},
    })

    const gen: string = `${process.env.MNTID}${addOrder.id}${dto.amount}.00RUB${user.email}012345`
    const MNT_SIGNATURE = createHash('md5').update(gen).digest('hex')

    // TODO: Сделать страницу успешной оплаты
    // &MNT_SUCCESS_URL=${params.mntSuccessUri}&amp;

    const url: string =
      `https://www.payanyway.ru/assistant.widget?MNT_ID=${process.env.MNTID}&MNT_AMOUNT=${dto.amount}.00` +
      `&MNT_DESCRIPTION=${dto.transactionTitle}&MNT_SUBSCRIBER_ID=${user.email}&MNT_CURRENCY_CODE=RUB` +
      `&MNT_SIGNATURE=${MNT_SIGNATURE}&MNT_TRANSACTION_ID=${addOrder.id}`

    await this.prisma.userOrders.update({
      where: {id: addOrder.id},
      data: {transaction_link: url, size: dto.size},
    })

    // TODO: Перенести это в обработчик
    // await this.prisma.user.update({
    //   where: {chat_id: dto.chat_id},
    //   data: {
    //     count: {
    //       increment: 1,
    //     },
    //   },
    // })

    return url
  }
}
