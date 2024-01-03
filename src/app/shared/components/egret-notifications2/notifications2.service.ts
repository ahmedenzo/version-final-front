import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Notifications2Service {
  isPanelOpen: boolean = false;
  private _notificationCount = new BehaviorSubject<number>(0);
  notificationCount$ = this._notificationCount.asObservable();




  
  updateCount(count: number) {
    this._notificationCount.next(count);
  }
  
  constructor() { }
}
