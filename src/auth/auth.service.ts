import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/Login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existUser = await this.usersService.isUserExist(
      createUserDto.username,
      createUserDto.email,
    );
    if (existUser) {
      throw new ConflictException('username | email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    createUserDto.password = hashedPassword;
    const createdUser = await this.usersService.create(createUserDto);

    const { password, ...safeUserInfo } = createdUser;
    return safeUserInfo;
  }

  async login(loginDto: LoginDto) {
    const foundUser = await this.usersService.findByUsername(loginDto.username);
    if (!foundUser) {
      throw new NotFoundException('cardintials doesnt match in our data');
    }

    const typedCurrentPassword = loginDto.password;
    const currentPassword = foundUser.password;

    const isPassCorrect = await bcrypt.compare(
      typedCurrentPassword,
      currentPassword,
    );

    if (!isPassCorrect) {
      throw new NotFoundException('cardintials doesnt match in our data');
    }

    const payload = { id: foundUser.id, username: foundUser.username };
    const accesstoken = await this.jwtService.signAsync(payload);

    return accesstoken;
  }
}
