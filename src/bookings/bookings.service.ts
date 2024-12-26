import { Injectable, NotFoundException } from '@nestjs/common';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { HotelsService } from '../hotels/hotels.service';

@Injectable()
export class BookingsService {
  
  constructor(private readonly hotelsService: HotelsService) {}
 
  getBookings() {
    const data = this.hotelsService.loadData();
    return data.bookings;
  }

  create(createBookingDto: CreateBookingDto): Booking {
    const data = this.hotelsService.loadData();
    const hotel = data.hotels.find(h => h.id === createBookingDto.hotelId);

    if (!hotel || hotel.roomsAvailable < createBookingDto.rooms) {
      throw new Error('Not enough rooms available');
    }

    hotel.roomsAvailable = (hotel.roomsAvailable- createBookingDto.rooms);
    const newBooking: Booking = {
        id: (data.bookings.length + 1).toString(),
        ...createBookingDto,
      };
    data.bookings.push(newBooking);
    this.hotelsService.saveData(data);

    return newBooking;
  }

  update(id: string, updateBookingDto: UpdateBookingDto): Booking {
    const data = this.hotelsService.loadData();
    const bookingIndex = data.bookings.findIndex(b => b.id === id);

    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }

    const booking = data.bookings[bookingIndex];
    const hotel = data.hotels.find(h => h.id === booking.hotelId);

    if (!hotel || hotel.roomsAvailable + booking.rooms < updateBookingDto.rooms) {
      throw new Error('Not enough rooms available to update booking');
    }

    hotel.roomsAvailable += booking.rooms - updateBookingDto.rooms;
    data.bookings[bookingIndex] = { ...booking, ...updateBookingDto };
    this.hotelsService.saveData(data);

    return booking;
  }

  remove(id: string): Booking[] {
    const data = this.hotelsService.loadData();
    const bookingIndex = data.bookings.findIndex(b => b.id === id);

    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }

    const booking = data.bookings[bookingIndex];
    const hotel = data.hotels.find(h => h.id === booking.hotelId);

    if (hotel) {
      hotel.roomsAvailable += booking.rooms;
    }

    data.bookings.splice(bookingIndex, 1);
    this.hotelsService.saveData(data);

    return data.bookings;
  }
}
