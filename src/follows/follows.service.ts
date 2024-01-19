import { Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Follow } from './entities/follow.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private usersRepository: Repository<Follow>,
  ) {}

  create(createFollowDto: CreateFollowDto, req: any) {
    const user = req.user;
    return 'This action adds a new follow';
  }

  findAll() {
    return `This action returns all follows`;
  }

  findOne(id: number) {
    return `This action returns a #${id} follow`;
  }

  update(id: number, updateFollowDto: UpdateFollowDto) {
    return `This action updates a #${id} follow`;
  }

  remove(id: number) {
    return `This action removes a #${id} follow`;
  }
}
