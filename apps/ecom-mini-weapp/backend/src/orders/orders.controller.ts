import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { OrdersService } from './orders.service'
import { Order } from './order.schema'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query() query: { status?: string }) {
    return this.ordersService.findAll(query)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async getMyOrders(@Req() req: any) {
    return this.ordersService.getUserOrders(req.user.userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createOrderDto: Partial<Order>) {
    return this.ordersService.create(createOrderDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/payment')
  async updatePayment(
    @Param('id') id: string,
    @Body() body: { status: string; transactionId?: string }
  ) {
    return this.ordersService.updatePaymentStatus(id, body.status, body.transactionId)
  }
}
