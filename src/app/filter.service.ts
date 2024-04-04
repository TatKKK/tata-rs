import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public filterTermSource = new BehaviorSubject<string>('');
  currentFilter = this.filterTermSource.asObservable();

  private dataFoundSource = new BehaviorSubject<boolean>(true);
  currentDataFound = this.dataFoundSource.asObservable();


  constructor() { }

  changeFilter(term: string) {
    this.filterTermSource.next(term);
    
  }
  updateDataFoundState(isDataFound: boolean) {
    this.dataFoundSource.next(isDataFound);
  }
}
