import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { HotelsService } from 'src/hotels/hotels.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, HotelsService]
})
export class BookingsModule {}
