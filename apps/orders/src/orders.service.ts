import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma/prisma.service';
import { OrderStatus } from '.prisma/client/orders';
import { OrderDto } from './dtos/order.dto';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private prismaService: PrismaService,
    @Inject('ORDERS_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  all() {
    return this.prismaService.order.findMany();
  }

  async create(data: OrderDto) {
    const orders = await this.prismaService.order.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });

    await lastValueFrom(this.kafkaClient.emit('orders', orders));
    return orders;
  }

  complete(id: number, status: OrderStatus) {
    return this.prismaService.order.update({
      where: { id },
      data: { status },
    });
  }
}
