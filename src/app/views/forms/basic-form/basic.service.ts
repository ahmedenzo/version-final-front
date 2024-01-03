import { Injectable } from '@angular/core';
import * as countrycitystatejson from 'countrycitystatejson';
@Injectable({
  providedIn: 'root'
})
export class BasicService {
  private countryData = countrycitystatejson;
  constructor() { }
  getCountries() {
    return this.countryData.getCountries();
  }

  getStatesByCountry(name: string) {
    return this.countryData.getStatesByShort(name);
  }

}
