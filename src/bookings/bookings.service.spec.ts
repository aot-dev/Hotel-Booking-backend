
import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { HotelsService } from '../hotels/hotels.service';

describe('BookingsService', () => {
  let bookingsService: BookingsService;
  let hotelDataService: HotelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: HotelsService,
          useValue: {
            loadData: jest.fn(),
            saveData: jest.fn(),
          },
        },
      ],
    }).compile();

    bookingsService = module.get<BookingsService>(BookingsService);
    hotelDataService = module.get<HotelsService>(HotelsService);
  });

  it('should be defined', () => {
    expect(BookingsService).toBeDefined();
  });

  describe('bookRoom', () => {
    it('should book a room successfully', () => {
      const mockData = {
        hotels: [
          { id: '1', name: 'Grand Hotel', roomsAvailable: 10 },
        ],
        bookings: [],
      };

      jest.spyOn(hotelDataService, 'loadData').mockReturnValue(mockData);

      const bookingDetails = { hotelId: '1', numRooms: 2, checkInDate:'12/12/2024', checkOutDate:'15/12/2024'};
      const result = bookingsService.create(bookingDetails);

      expect(result).toBeTruthy();
      expect(mockData.hotels[0].roomsAvailable).toBe(8);
      expect(mockData.bookings.length).toBe(1);
      expect(hotelDataService.saveData).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if not enough rooms are available', () => {
      const mockData = {
        hotels: [
          { id: '1', name: 'Grand Hotel', roomsAvailable: 1 },
        ],
        bookings: [],
      };

      jest.spyOn(hotelDataService, 'loadData').mockReturnValue(mockData);

      const bookingDetails = { hotelId: '1', numRooms: 2, checkInDate:'12/12/2024', checkOutDate:'15/12/2024'};

      expect(() => bookingsService.create(bookingDetails)).toThrow(
        'Not enough rooms available',
      );
    });
  });

  describe('updateBooking', () => {
    it('should update a booking successfully', () => {
      const mockData = {
        hotels: [
          { id: '1', name: 'Grand Hotel', roomsAvailable: 5 },
        ],
        bookings: [
          { id: 'b1', hotelId: '1', numRooms: 2, userId: '123' },
        ],
      };

      jest.spyOn(hotelDataService, 'loadData').mockReturnValue(mockData);

      const updatedDetails = { numRooms: 3 };
      const result = bookingsService.update('b1', updatedDetails);

      expect(result).toBeTruthy();
      expect(mockData.hotels[0].roomsAvailable).toBe(4);
      expect(mockData.bookings[0].numRooms).toBe(3);
      expect(hotelDataService.saveData).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if booking is not found', () => {
      const mockData = { hotels: [], bookings: [] };

      jest.spyOn(hotelDataService, 'loadData').mockReturnValue(mockData);

      expect(() => bookingsService.update('invalid', {})).toThrow(
        'Booking not found',
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking successfully', () => {
      const mockData = {
        hotels: [
          { id: '1', name: 'Grand Hotel', roomsAvailable: 5 },
        ],
        bookings: [
          { id: 'b1', hotelId: '1', rooms: 2, userId: '123' },
        ],
      };

      jest.spyOn(hotelDataService, 'loadData').mockReturnValue(mockData);

      const result = bookingsService.remove('b1');

      expect(result.length).toEqual(0);
      expect(mockData.bookings.length).toBe(0);
      expect(hotelDataService.saveData).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if booking is not found', () => {
      const mockData = { hotels: [], bookings: [] };

      jest.spyOn(hotelDataService, 'loadData').mockReturnValue(mockData);

      expect(() => bookingsService.remove('invalid')).toThrow(
        'Booking not found',
      );
    });
  });
});
