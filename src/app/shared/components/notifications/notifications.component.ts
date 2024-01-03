import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { GeneratedfileService } from 'app/views/generatefile-ftp/generatedfile.service';
import { Notifications2Service } from '../egret-notifications2/notifications2.service';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  @Input() notificPanel;
  @Output() totalNotifications = new EventEmitter<number>();

  notifications = [];

  constructor(private router: Router,private GeneratedfileService:GeneratedfileService,private Notifications2Service :Notifications2Service,private translateService: TranslateService) {}

  ngOnInit() {
    this.router.events.subscribe((routeChange) => {
        if (routeChange instanceof NavigationEnd) {
            this.notificPanel.close();
        }
    });
    

    this.updateNotificationCount();
   
}

updateNotificationCount() {
    let totalCount = 0;
  
    this.GeneratedfileService.getCardsCreatedAndNotConfirmed().subscribe(cards => {
      if (cards.length) {
        totalCount += cards.length;
        this.notifications.push({
          message: this.translateService.instant('CARD_CREATED_NOT_CONFIRMED', { count: cards.length }),
          icon: 'error_outline',
          time: 'Just now', // Translate if needed
          route: '/path_to_cardholders',
          color: 'warn'
        });
      }
  
      this.GeneratedfileService.getCardsConfirmedAndNotGenerated().subscribe(cards => {
        if (cards.length) {
          totalCount += cards.length;
          this.notifications.push({
            message: this.translateService.instant('CARD_CONFIRMED_NOT_GENERATED', { count: cards.length }),
            icon: 'warning',
            time: 'Just now', // Translate if needed
            route: '/path_to_cardholders',
            color: 'primary'
          });
        }
  
        this.GeneratedfileService.getCardsUpdatedAndNotGenerated().subscribe(cards => {
          if (cards.length) {
            totalCount += cards.length;
            this.notifications.push({
              message: this.translateService.instant('CARD_UPDATED_NOT_GENERATED', { count: cards.length }),
              icon: 'info',
              time: 'Just now', // Translate if needed
              route: '/path_to_cardholders',
              color: 'accent'
            });
          }
          
          // Emit total count only once after all services have been checked
          this.Notifications2Service.updateCount(totalCount);
        });
      });
    });
  }
  
  
  clearAll(e) {
    e.preventDefault();
    this.notifications = [];
  }
}
