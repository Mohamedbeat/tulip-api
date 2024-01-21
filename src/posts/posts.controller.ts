import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request, Response } from 'express';
import { NoAuth } from 'src/auth/decorators/noauth.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.postsService.create(createPostDto, req);
    res.json(response);
  }
  @NoAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Query('limit') limit: string, @Query('page') page: string) {
    const intLimit = parseInt(limit);
    const intPage = parseInt(page);
    return this.postsService.findAll(intLimit, intPage);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
