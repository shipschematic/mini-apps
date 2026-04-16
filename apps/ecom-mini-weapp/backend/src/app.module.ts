import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { ProductsModule } from './products/products.module'
import { OrdersModule } from './orders/orders.module'
import { WechatModule } from './wechat/wechat.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/whitelabel'),
    AuthModule,
    ProductsModule,
    OrdersModule,
    WechatModule,
  ],
})
export class AppModule {}
