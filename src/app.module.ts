import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {UserModule} from './user/user.module'
import {PrismaService} from './prisma.service'
import {PhotoModule} from './photo/photo.module'
import { ProductModule } from './product/product.module';

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
  imports: [UserModule, PhotoModule, ProductModule],
})
export class AppModule {}
