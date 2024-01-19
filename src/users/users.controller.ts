import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { NoAuth } from 'src/auth/decorators/noauth.decorator';
import * as fs from 'fs';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @NoAuth()
  @Get()
  findAll(@Query('limit') limit: string, @Query('page') page: string) {
    const intLimit = parseInt(limit);
    const intPage = parseInt(page);
    return this.usersService.findAll(intLimit, intPage);
  }
  @NoAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const updatedUser = await this.usersService.update(
      id,
      updateUserDto,
      request,
    );
    response.json(updatedUser);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const res = await this.usersService.remove(id, request);
    response.send(res);
  }

  @Post('profilePicture')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profilePictures',
        filename: (req, file, cb) => {
          const fileExtName = path.extname(file.originalname);
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          // const userId = req.user.id;
          cb(null, file.fieldname + '-' + uniqueSuffix + fileExtName);
        },
      }),
    }),
  )
  setProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return this.usersService.setProfilePicture(file, request);
  }

  @NoAuth()
  @Get('profilePicture/:id')
  async getProfilePicture(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const picturePath = await this.usersService.getProfilePicturePath(id);
    // console.log(path);

    response.redirect(
      'http://localhost:3000/' + picturePath.replaceAll('\\', '/'),
    );
  }
}
