import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order, OrderDocument } from './order.schema'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async create(createOrderDto: Partial<Order>): Promise<Order> {
    const order = new this.orderModel(createOrderDto)
    return order.save()
  }

  async findAll(filters?: { status?: string; userId?: string }): Promise<Order[]> {
    const query: any = {}

    if (filters?.status) query['payment.status'] = filters.status
    if (filters?.userId) query.userId = filters.userId

    return this.orderModel.find(query).sort({ createdAt: -1 }).exec()
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec()
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`)
    }
    return order
  }

  async updatePaymentStatus(id: string, status: string, transactionId?: string): Promise<Order> {
    const update: any = {
      'payment.status': status,
      updatedAt: new Date(),
    }

    if (transactionId) {
      update['payment.transactionId'] = transactionId
    }

    if (status === 'paid') {
      update['payment.paidAt'] = new Date()
    }

    const order = await this.orderModel
      .findByIdAndUpdate(id, { $set: update }, { new: true })
      .exec()

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`)
    }

    return order
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec()
  }
}
