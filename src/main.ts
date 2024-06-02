import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import * as fs from 'fs'
import * as https from 'https'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('/etc/letsencrypt/live/stockhub12.ru/privkey.pem'),
  //   cert: fs.readFileSync('/etc/letsencrypt/live/stockhub12.ru/fullchain.pem'),
  // }

  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
  })

  const config = new DocumentBuilder()
    .setTitle('StockHub Server')
    .setDescription('StockHub Server')
    .setVersion('1.0')
    .addTag('stock')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.setGlobalPrefix('api')
  app.enableCors()
  await app.listen(4200)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
