import { Component, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Doctor } from '../../models/doctor.model';
import { DoctorsService } from '../../services/doctors.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  faAngleRight=faAngleRight;
  faAngleDown=faAngleDown;
  
categoryCounts:{[category: string]:number}={};
displayedCategories:any[]=[];
public initialDisplayCount: number = 6;

  constructor(public doctorsService:DoctorsService){
  }

  ngOnInit(): void {
    this.doctorsService.getDoctors().subscribe(doctors => {
      this.countCategories(doctors);
      this.sliceDisplayedCategories();
    });
    console.log("displayed categories"+this.displayedCategories);
  
  }

  private countCategories(doctors: Doctor[]): void {
    doctors.forEach(doctor => {
      if (doctor.Category) {
        this.categoryCounts[doctor.Category] = (this.categoryCounts[doctor.Category] || 0) + 1;
      }
    });
  }

  public sliceDisplayedCategories(): void {
    const categories = Object.entries(this.categoryCounts) 
      .map(([key, value]) => ({ key, value })) 
      .slice(0, this.initialDisplayCount); 

    this.displayedCategories = categories;
    console.log(categories);
    console.log(JSON.stringify(this.displayedCategories));

  }

  loadMore(): void {
    console.log('invoked');  
    const categories = Object.entries(this.categoryCounts)
      .map(([key, value]) => ({ key, value }));    
    this.displayedCategories = categories; 
  }

}
