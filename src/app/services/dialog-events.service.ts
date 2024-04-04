import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogEventsService {
  private closeDialogsSource = new BehaviorSubject<boolean>(false);

  closeDialogs$ = this.closeDialogsSource.asObservable();

  constructor() { }

  requestCloseDialogs() {
    this.closeDialogsSource.next(true);
  }
}
