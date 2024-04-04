import { Component, OnInit, OnDestroy , ViewChild, ElementRef} from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('filterName') filterNameInput?: ElementRef;
  @ViewChild('filterCategory') filterCategoryInput?: ElementRef;
 
  private dataFoundSubscription:Subscription | undefined;
  isDataFound:boolean=true;

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.dataFoundSubscription = this.filterService.currentDataFound.subscribe(isDataFound => {
      this.isDataFound = isDataFound;
      if (!this.isDataFound) {
        this.resetInputFields();
      }
  })
  }

 
  private resetInputFields(): void {
    if (this.filterNameInput && this.filterNameInput.nativeElement) {
      this.filterNameInput.nativeElement.value = '';
    }
    if (this.filterCategoryInput && this.filterCategoryInput.nativeElement) {
      this.filterCategoryInput.nativeElement.value = '';
    }
  }
    ngOnDestroy() {      
      this.dataFoundSubscription?.unsubscribe();
    }

    filterResults(filterNameValue: string, filterCategoryValue: string): void {
      const combinedFilter = `${filterNameValue} ${filterCategoryValue}`.trim();
      this.filterService.changeFilter(combinedFilter);
      console.log("filter applied", combinedFilter);
    }
 
}
