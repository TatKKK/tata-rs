import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-app';

  userRole!:string;


  constructor(private authService: AuthService) {
  }

  
  ngOnInit(): void {
    this.userRole=this.authService.getUserRole();

  }
  

 
}
