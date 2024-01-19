import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const createdPayment = await this.paymentsRepository.save(createPaymentDto);
    return createdPayment;
  }

  async findAll() {
    const foundPayments = await this.paymentsRepository.find();
    return foundPayments;
  }

  async findOne(id: string) {
    const foundPayment = await this.paymentsRepository.findOneBy({ id: id });
    if (!foundPayment) {
      throw new NotFoundException('payment not found');
    }
    return foundPayment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const foundPayment = await this.paymentsRepository.findOneBy({ id: id });
    if (!foundPayment) {
      throw new NotFoundException('payment not found');
    }

    foundPayment.currency = updatePaymentDto.currency;
    foundPayment.amount = updatePaymentDto.amount;
    await this.paymentsRepository.save(foundPayment);
    return foundPayment;
  }

  async remove(id: string) {
    const foundPayment = await this.paymentsRepository.findOneBy({ id: id });
    if (!foundPayment) {
      throw new NotFoundException('payment not found');
    }

    await this.paymentsRepository.delete({ id: id });
    return `payment with id ${id} deleted successfully`;
  }
}
