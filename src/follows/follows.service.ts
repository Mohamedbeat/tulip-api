import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Follow } from './entities/follow.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async followUser(createFollowDto: CreateFollowDto, req: any) {
    const followerId = req.user.id;

    if (followerId === createFollowDto.followingId) {
      throw new BadRequestException("you can't follow your self XD");
    }

    const follower = await this.usersRepository.findOne({
      where: {
        id: followerId,
      },
      relations: { following: true, followers: true },
    });
    const following = await this.usersRepository.findOne({
      where: {
        id: createFollowDto.followingId,
      },
      relations: { following: true, followers: true },
    });
    if (!follower) {
      throw new NotFoundException('follower not found');
    }

    if (!following) {
      throw new NotFoundException('following not found');
    }

    const followExsist = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: following.id } },

      relations: { follower: true, following: true },
    });

    if (followExsist) {
      throw new ConflictException('you already followed this user');
    }
    const follow = this.followRepository.create({ follower, following });
    const savedFollow = await this.followRepository.save(follow);
    return { message: 'followed sucessfully' };
  }

  async unFollowUser(createFollowDto: CreateFollowDto, req: any) {
    const followerId = req.user.id;

    if (followerId === createFollowDto.followingId) {
      throw new BadRequestException("you can't follow your self XD");
    }

    const follower = await this.usersRepository.findOne({
      where: {
        id: followerId,
      },
      relations: { following: true, followers: true },
    });
    const following = await this.usersRepository.findOne({
      where: {
        id: createFollowDto.followingId,
      },
      relations: { following: true, followers: true },
    });
    if (!follower) {
      throw new NotFoundException('follower not found');
    }

    if (!following) {
      throw new NotFoundException('following not found');
    }

    const followExsist = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: following.id } },

      relations: { follower: true, following: true },
    });

    if (!followExsist) {
      throw new NotFoundException("can't unfollow");
    }

    const savedFollow = await this.followRepository.delete(followExsist);
    return { message: 'unfollowed sucessfully' };
  }

  async getFollowers(id: string) {
    const userExsist = await this.usersRepository.findOne({
      where: { id },
      relations: { followers: true },
    });
    if (!userExsist) {
      throw new NotFoundException('user not found');
    }

    const followersList = await this.followRepository.find({
      where: { following: { id: id } },
      relations: { follower: true, following: true },
    });

    return followersList;
  }
  async getFollowings(id: string) {
    const userExsist = await this.usersRepository.findOne({
      where: { id },
      relations: { followers: true },
    });
    if (!userExsist) {
      throw new NotFoundException('user not found');
    }

    const followingList = await this.followRepository.find({
      where: { follower: { id: id } },
      relations: { follower: true, following: true },
    });

    return followingList;
  }
}
