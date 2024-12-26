import { Injectable } from '@nestjs/common';
import { Hotel } from './hotel.enitity';
import { readJsonSync, writeJsonSync } from 'fs-extra';
import { join } from 'path';

const DATA_PATH = join(__dirname, '../../data.json');

const SAMPLE_DATA = {
    hotels: [
        { id: '1', name: 'Mountain Hotel', location: 'Bengaluru', roomsAvailable: 8 },
        { id: '2', name: 'Celebrity Hotel', location: 'Bengaluru', roomsAvailable: 10 },
        { id: '3', name: 'Mohmaya Hotel', location: 'Bengaluru', roomsAvailable: 8 },
        { id: '4', name: 'Charminar Hotel', location: 'Hydrabad', roomsAvailable: 4 },
        { id: '5', name: 'Marathi Hotel', location: 'Pune', roomsAvailable: 2 },
        { id: '6', name: 'Bihari Hotel', location: 'Patna', roomsAvailable: 3 }
      ],
    bookings: []
  };

@Injectable()
export class HotelsService {
    

  loadData() {
    try {
      return readJsonSync(DATA_PATH);
    } catch {
      this.saveData(SAMPLE_DATA);
      return SAMPLE_DATA;
    }
  }

  saveData(data: any) {
    writeJsonSync(DATA_PATH, data, { spaces: 2 });
  }
  findAll(location?: string): Hotel[] {
    const data = this.loadData();
    if (location) {
      return data.hotels.filter((hotel) => hotel.location == location);
    }
    return data.hotels;
  }
}