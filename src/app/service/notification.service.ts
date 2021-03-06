import { Injectable } from '@angular/core';
import {NotifierService} from "angular-notifier";
import {NotificationType} from "../enum/notification-type.enum";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
private notifier!: NotifierService;
  // @ts-ignore
  constructor(private notifier: NotifierService) {
  }


  public notify(type: NotificationType, message: string) {
    this.notifier.notify(type, message);
  }
}
