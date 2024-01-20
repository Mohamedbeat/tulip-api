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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Request, Response } from 'express';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('follow')
  async followUser(
    @Body() createFollowDto: CreateFollowDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const follow = await this.followsService.followUser(createFollowDto, req);
    res.json(follow);
  }
  @HttpCode(HttpStatus.OK)
  @Post('unfollow')
  async unFollowUser(
    @Body() createFollowDto: CreateFollowDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const follow = await this.followsService.unFollowUser(createFollowDto, req);
    res.json(follow);
  }

  @Get('followers/:id')
  getFollowers(@Param('id') id: string) {
    return this.followsService.getFollowers(id);
  }
  @Get('followings/:id')
  getFollowings(@Param('id') id: string) {
    return this.followsService.getFollowings(id);
  }
}
