import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Product, ProductDocument } from './product.schema'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async create(createProductDto: Partial<Product>): Promise<Product> {
    const product = new this.productModel(createProductDto)
    return product.save()
  }

  async findAll(filters?: { status?: string; type?: string; category?: string }): Promise<Product[]> {
    const query: any = {}

    if (filters?.status) query.status = filters.status
    if (filters?.type) query.type = filters.type
    if (filters?.category) query.category = filters.category

    return this.productModel.find(query).exec()
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec()
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`)
    }
    return product
  }

  async update(id: string, updateProductDto: Partial<Product>): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, { ...updateProductDto, updatedAt: new Date() }, { new: true })
      .exec()

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`)
    }

    return product
  }

  async delete(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException(`Product ${id} not found`)
    }
  }

  async updateStatus(id: string, status: string): Promise<Product> {
    return this.update(id, { status } as Partial<Product>)
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.productModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec()
  }

  async incrementPurchaseCount(id: string): Promise<void> {
    await this.productModel.findByIdAndUpdate(id, { $inc: { purchaseCount: 1 } }).exec()
  }
}
