import {BadRequestException, Injectable} from '@nestjs/common'
import {
  AddAddressDto,
  addBasketItemDto,
  AddDto,
  AddEmailDto,
  AddFIODto,
  AddRequsetOrderDto,
  DelBasketItemDto,
} from '../dto/user.dto'
import {PrismaService} from 'src/prisma.service'
import {createHash} from 'crypto'
import * as process from 'node:process'
import {DOMParser, XMLSerializer} from 'xmldom'

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
        basket: {
          include: {
            Product: {
              include: {
                ProductVariant: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw new BadRequestException(`Пользователь с ${chat_id} не найден`)
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
      basket: user.basket.map(item => ({
        userId: item.userId,
        article: item.article,
        size: item.size,
        product: {
          article: item.Product.article,
          name: item.Product.name,
          brand: item.Product.brand,
          model: item.Product.model,
          material: item.Product.material,
          photos: item.Product.photos,
          variants: item.Product.ProductVariant.map(variant => ({
            color: variant.color,
            price: variant.price,
          })),
        },
      })),
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
      data: {
        userId: user.id,
        article: dto.article,
        size: dto.size,
        status: 'IN_PROGRESS',
      },
      select: {id: true},
    })

    const gen: string = `${process.env.MNTID}${addOrder.id}${dto.amount}.00RUB${user.email}012345`
    const MNT_SIGNATURE = createHash('md5').update(gen).digest('hex')

    const url: string =
      `https://www.payanyway.ru/assistant.widget?MNT_ID=${process.env.MNTID}&MNT_AMOUNT=${dto.amount}.00` +
      `&MNT_DESCRIPTION=${dto.transactionTitle}&MNT_SUBSCRIBER_ID=${user.email}&MNT_CURRENCY_CODE=RUB` +
      `&MNT_SIGNATURE=${MNT_SIGNATURE}&MNT_TRANSACTION_ID=${addOrder.id}&MNT_SUCCESS_URL=https://stockhub12.ru`

    await this.prisma.userOrders.update({
      where: {id: addOrder.id},
      data: {transaction_link: url, size: dto.size},
    })

    return url
  }

  async getCallback(dto) {
    const getData = {
      mntId: process.env.MNTID,
      mntTransactionId: dto.MNT_TRANSACTION_ID,
      email: dto.MNT_SUBSCRIBER_ID,
      amount: dto.MNT_AMOUNT,
      signature: dto.MNT_SIGNATURE,
    }

    const GEN_SIGNATURE = createHash('md5')
      .update(
        `${process.env.MNTID}${dto.MNT_TRANSACTION_ID}${dto.MNT_OPERATION_ID}${dto.MNT_AMOUNT}${dto.MNT_CURRENCY_CODE}${dto.MNT_SUBSCRIBER_ID}012345`,
      )
      .digest('hex')

    const GEN_XML = createHash('md5')
      .update(`200${getData.mntId}${getData.mntTransactionId}12345`)
      .digest('hex')

    if (getData.mntTransactionId === undefined)
      return 'FAIL. MNT_TRANSACTION_ID IS EMPTY'

    if (getData.signature !== GEN_SIGNATURE) return 'FAIL. BAD SIGNATURE'

    // TODO: поменять статус заказа

    const inventoryPositions = [
      {
        name: 'Услуга по поиску, подбору, заказу и доставки товара',
        price: getData.amount,
        quantity: '1',
        vatTag: '1105',
        po: 'service',
      },
    ]

    const xmlString = `<?xml version="1.0" encoding="UTF-8"?> 
                      <MNT_RESPONSE>
                        <MNT_ID>${getData.mntId}</MNT_ID>
                        <MNT_TRANSACTION_ID>${getData.mntTransactionId}</MNT_TRANSACTION_ID>
                        <MNT_RESULT_CODE>200</MNT_RESULT_CODE>
                        <MNT_SIGNATURE>${GEN_XML}</MNT_SIGNATURE>
                        <MNT_ATTRIBUTES>
                          <ATTRIBUTE> 
                            <KEY>INVENTORY</KEY>
                            <VALUE>${JSON.stringify(inventoryPositions)}</VALUE>
                          </ATTRIBUTE>
                          <ATTRIBUTE> 
                            <KEY>CUSTOMER</KEY>
                            <VALUE>${getData.email}</VALUE>
                          </ATTRIBUTE>
                        </MNT_ATTRIBUTES>
                      </MNT_RESPONSE>`

    const domParser = new DOMParser()
    const xmlDoc = domParser.parseFromString(xmlString, 'application/xml')

    const xmlSerializer = new XMLSerializer()
    return xmlSerializer.serializeToString(xmlDoc)
  }

  async addItemBasket(dto: addBasketItemDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        chat_id: dto.userId.toString(),
      },
      select: {basket: true},
    })

    if (!user) throw new BadRequestException('User not found')

    return this.prisma.userBasket.create({
      data: {
        userId: dto.userId,
        size: dto.size,
        article: dto.article,
      },
    })
  }

  async delItemBasket(dto: DelBasketItemDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        chat_id: dto.chat_id.toString(),
      },
      select: {basket: true},
    })

    if (!user) throw new BadRequestException('User not found')

    const deletedItem = await this.prisma.userBasket.deleteMany({
      where: {
        userId: dto.chat_id,
        size: dto.size,
      },
    })

    if (deletedItem.count === 0) {
      return false
    }
    const updatedUser = await this.prisma.user.findUnique({
      where: {
        chat_id: dto.chat_id.toString(),
      },
      select: {basket: true},
    })

    return updatedUser.basket
  }
}
