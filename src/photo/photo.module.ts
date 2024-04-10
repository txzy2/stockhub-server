import {Module} from '@nestjs/common'
import {PhotoService} from './photo.service'
import {PhotoController} from './photo.controller'
import {PrismaService} from 'src/prisma.service'

@Module({
  controllers: [PhotoController],
  providers: [PhotoService, PrismaService],
})
export class PhotoModule {}
