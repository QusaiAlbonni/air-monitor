import { Injectable } from '@nestjs/common';
import { places } from '../static/places';

@Injectable()
export class PlaceService {
  findPlaces() {
    return places;
  }
}
