import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.usersRepo.save(createUserDto);
    return createdUser;
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

    const foundUsers = await this.usersRepo.find({
      skip: skip,
      take: limit,
      select: ['id', 'username', 'email', 'photoUrl', 'isActivated'],
    });

    return foundUsers;
  }

  async findOne(id: string) {
    const existUser = await this.usersRepo.findOne({
      where: { id },
      relations: { followers: true, following: true },
    });
    if (!existUser) {
      throw new NotFoundException('user not found');
    }
    const { password, ...safeUserInfos } = existUser;
    return safeUserInfos;
  }

  async update(id: string, updateUserDto: UpdateUserDto, request: any) {
    const user = request.user;
    if (user.id !== id) {
      throw new UnauthorizedException('you are not authorized');
    }
    const existUser = await this.usersRepo.findOneBy({ id: id });
    if (!existUser) {
      throw new NotFoundException('user not found');
    }

    const isEmailReserved = await this.usersRepo.findOneBy({
      email: updateUserDto.email,
    });
    const isUsernameReserved = await this.usersRepo.findOneBy({
      username: updateUserDto.username,
    });
    if (isEmailReserved) {
      throw new ConflictException(
        `this email (${updateUserDto.email}) is not availale`,
      );
    }
    if (isUsernameReserved) {
      throw new ConflictException(
        `this username (${updateUserDto.username}) is not availale`,
      );
    }

    const { typedCurrentPassword, ...updateUserInfos } = updateUserDto;
    const currentPassword = existUser.password;

    const isPassCorrect = await bcrypt.compare(
      typedCurrentPassword,
      currentPassword,
    );
    if (!isPassCorrect) {
      throw new BadRequestException('wrong password');
    }

    existUser.username = updateUserInfos.username;
    existUser.email = updateUserInfos.email;

    if (updateUserInfos.password) {
      const hashedPassword = await bcrypt.hash(updateUserInfos.password, 10);
      existUser.password = hashedPassword;
    }

    await this.usersRepo.save(existUser);

    const { password, ...safeUserInfo } = existUser;

    return safeUserInfo;
  }

  async remove(id: string, request: any) {
    const user = request.user;
    if (user.id !== id) {
      throw new UnauthorizedException('you are not authorized');
    }
    const existUser = await this.usersRepo.findOneBy({ id: id });
    if (!existUser) {
      throw new NotFoundException('user not found');
    }

    await this.usersRepo.delete({ id: id });
    return `user with id  (${id}) deleted successfully`;
  }

  async setProfilePicture(file: Express.Multer.File, req: any) {
    if (!file) {
      throw new BadRequestException('please select a photo');
    }

    // console.log(__dirname);
    const userId = req.user.id;
    const updatedUser = await this.usersRepo.findOneBy({ id: userId });

    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }

    updatedUser.photoUrl = 'uploads\\profilePictures\\' + file.filename;
    await this.usersRepo.save(updatedUser);

    return 'profile picture added successfully ';
  }

  async getProfilePicturePath(id: string) {
    const foundUser = await this.usersRepo.findOneBy({ id: id });

    if (!foundUser) {
      throw new NotFoundException('user not found');
    }

    return foundUser.photoUrl;
  }

  async isUserExist(username: string, email: string) {
    const foundUser = await this.usersRepo.find({
      where: [{ username: username }, { email: email }],
    });
    if (foundUser.length === 0) {
      return;
    }
    return foundUser;
  }

  async findByUsername(username: string) {
    const foundUser = await this.usersRepo.findOneBy({ username: username });

    return foundUser;
  }
}
