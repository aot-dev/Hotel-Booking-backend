import { Module } from '@nestjs/common';
import { HotelsModule } from './hotels/hotels.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [HotelsModule, BookingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
