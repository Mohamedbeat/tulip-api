import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { NoAuth } from './auth/decorators/noauth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @NoAuth()
  @Get()
  getHello(@Req() req: Request, @Res() res: Response): void {
    const text = this.appService.getHello();
    res.send(text);
  }
  @NoAuth()
  @Post()
  getHelloo(@Req() req: Request, @Res() res: Response): void {
    res.cookie('name', 'ok');
    const text = this.appService.getHello();
    res.send(text);
  }
}
