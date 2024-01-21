import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto, req: any) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('you are not athenticated');
    }
    const userExist = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!userExist) {
      throw new UnauthorizedException('you are not found');
    }
    const newPost = this.postsRepository.create({
      desc: createPostDto.desc,
      user: userExist,
    });
    return await this.postsRepository.save(newPost);
  }

  async findAll(intLimit?: number, intPage?: number) {
    if (intLimit < 0) {
      intLimit = 0;
    }
    if (intPage < 0) {
      intPage = 0;
    }

    const limit = intLimit || 3;
    const page = intPage || 1;

    const skip = limit * (page - 1);

    const posts = await this.postsRepository.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'createdAt', 'updatedAt', 'desc'],
      relations: { user: true },
      skip: skip,
      take: limit,
    });
    posts.forEach((post) => {
      post.user = new User(post.user);
    });

    return posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
