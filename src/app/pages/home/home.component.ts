import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {  
  userRole!:string;

  constructor( private authService:AuthService){ }

  ngOnInit(): void {
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      this.userRole = userRole;
    } else {
      this.authService.getUserRole().subscribe(role => {
        this.userRole = role;
        localStorage.setItem('userRole', role);
      });
    }
  }

  
}
