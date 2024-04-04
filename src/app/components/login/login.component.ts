import { Component } from '@angular/core';
import { Login } from '../../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  login:Login=new Login();
  greeting:string="";
  token:string="";
  isLoggedIn!:boolean;

  showLoginForm = false;
  isAdmin=false;

  userName: string = '';
userImageUrl:string='';
userRole:string='';

  showAuth=true;

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedInStatus => {
      this.isLoggedIn = loggedInStatus;
      if (this.isLoggedIn) {
        this.showAuth = false;
      } else {
        this.showAuth = true;
      }
    });
  }

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }

constructor(private router:Router, 
  private authService:AuthService,
  private dialogRef:DynamicDialogRef){  
   
}

authenticate(): void {
  this.authService.authenticate(this.login).subscribe({
    next: (res) => {
      this.userImageUrl = this.authService.getImageUrlFromToken(res.AccessToken) || 'defaultImageUrl';
      this.userName = this.authService.getUserNameFromToken(res.AccessToken) || 'Anonymous User';
      this.userRole=this.authService.getUserRole();  
      this.isLoggedIn=this.authService.isLoggedInSync();
      if (this.isLoggedIn) {
        this.showLoginForm = false;
        this.showAuth = false;
        if (this.userRole === 'admin') { 
            this.router.navigate(['/doctorsList']); 
          } else {
            this.router.navigate(['/userPage', this.login.email]);
          }
        } else {
        console.error('Could not retrieve user ID from token');
      }
    }
  });
}
goToHomePage():void{
  this.router.navigate(['/']);
}
goToUserPage():void{
  this.router.navigate(['/userPage', this.login.email]);
}


closeLoginForm() {
  this.showLoginForm = false;
}


logout():void{
  this.authService.logout();
  this.showAuth=true;
}



}
