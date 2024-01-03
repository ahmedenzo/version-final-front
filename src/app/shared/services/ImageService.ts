import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageSource = new BehaviorSubject<string>(null);
  public image$ = this.imageSource.asObservable();

  constructor() { }

  public setImage(imageUrl: string): void {
    this.imageSource.next(imageUrl);
  }
}
