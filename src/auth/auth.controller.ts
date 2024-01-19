import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/Login.dto';
import { NoAuth } from './decorators/noauth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  signIn(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @Body() loginDto: LoginDto,
  ) {
    const token = await this.authService.login(loginDto);

    response.cookie('accessToken', token);
    response.json({ message: 'logged in sucessfully' });
  }

  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    response.clearCookie('accessToken');

    response.json({ message: 'logged out sucessfully' });
  }
}
