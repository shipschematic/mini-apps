import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ProductsService } from './products.service'
import { Product } from './product.schema'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: { status?: string; type?: string; category?: string }) {
    return this.productsService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    await this.productsService.incrementViewCount(id)
    return this.productsService.findOne(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createProductDto: Partial<Product>) {
    return this.productsService.create(createProductDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: Partial<Product>) {
    return this.productsService.update(id, updateProductDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.productsService.delete(id)
    return { success: true, message: 'Product deleted successfully' }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.productsService.updateStatus(id, status)
  }
}
