import { IsString, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  hotelId: string;

  @IsDateString()
  checkInDate: string;

  @IsDateString()
  checkOutDate: string;

  @IsNumber()
  @Min(1)
  numRooms: number;
}