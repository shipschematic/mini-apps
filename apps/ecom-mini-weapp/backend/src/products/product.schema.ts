import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ProductDocument = Product & Document

@Schema()
export class Product {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  price: number

  @Prop({ required: true, enum: ['digital', 'service', 'physical'] })
  type: string

  @Prop({ required: true, enum: ['download', 'unlock', 'ship'] })
  deliveryMethod: string

  @Prop()
  author: string

  @Prop()
  category: string

  @Prop()
  cover: string

  @Prop()
  preview: string

  @Prop()
  fullContent: string

  @Prop()
  downloadUrl: string

  @Prop({ type: [String] })
  tags: string[]

  @Prop({ default: 0 })
  rating: number

  @Prop({ default: 0 })
  reviewCount: number

  @Prop({ default: 0 })
  purchaseCount: number

  @Prop({ default: 0 })
  viewCount: number

  @Prop()
  inventory: number

  @Prop()
  sku: string

  @Prop({ required: true, enum: ['draft', 'published', 'archived'], default: 'draft' })
  status: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const ProductSchema = SchemaFactory.createForClass(Product)
