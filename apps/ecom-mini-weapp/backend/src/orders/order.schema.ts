import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type OrderDocument = Order & Document

@Schema()
export class OrderItem {
  @Prop({ required: true })
  productId: string

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  price: number

  @Prop({ required: true })
  quantity: number
}

@Schema()
export class Payment {
  @Prop({ required: true, enum: ['wechat'], default: 'wechat' })
  method: string

  @Prop({ required: true, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' })
  status: string

  @Prop()
  transactionId: string

  @Prop()
  paidAt: Date
}

@Schema()
export class Order {
  @Prop({ required: true })
  userId: string

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[]

  @Prop({ required: true })
  subtotal: number

  @Prop({ default: 0 })
  discount: number

  @Prop({ required: true })
  total: number

  @Prop({ type: Payment, required: true })
  payment: Payment

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const OrderSchema = SchemaFactory.createForClass(Order)
