import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  findAll(@Query('location') location?: string) {
    return this.hotelsService.findAll(location);
  }
}