import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Request, Response } from 'express';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  create(
    @Body() createFollowDto: CreateFollowDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.followsService.create(createFollowDto, req);
  }

  @Get()
  findAll() {
    return this.followsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFollowDto: UpdateFollowDto) {
    return this.followsService.update(+id, updateFollowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followsService.remove(+id);
  }
}