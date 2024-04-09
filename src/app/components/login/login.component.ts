import { Component } from '@angular/core';
import { Login } from '../../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  userRole:string='';
  login:Login=new Login();
  greeting:string="";
  token:string="";
  isLoggedIn!:boolean;

  showLoginForm = false;
  isAdmin=false;

  userName: string = '';
userImageUrl:string='';

// private destroy$ = new Subject<void>();


  showAuth=true;


userRole$: Observable<'patient' | 'doctor' | 'admin' | 'unknown'>;
  userImageUrl$: Observable<string>;
  isLoggedIn$: Observable<boolean>;

  ngOnInit(): void {
    this.userImageUrl$ = this.authService.getImageUrl();
   
    console.log('aaaaaaaaaaaaaaa', this.userRole);

    this.authService.isLoggedIn().subscribe(loggedInStatus => {
      this.isLoggedIn = loggedInStatus;
      if (this.isLoggedIn) {
        this.showAuth = false;
      } else {
        this.showAuth = true;
      }
    });
  }

  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }

constructor(private router:Router, 
  private authService:AuthService,
  private dialogRef:DynamicDialogRef){  

    this.userRole$ = this.authService.getUserRole();
    this.userImageUrl$ = this.authService.getImageUrl();
    this.isLoggedIn$ = this.authService.isLoggedIn();
   
}

authenticate(): void {
  this.authService.authenticate(this.login).subscribe({
    next: (res) => {
      this.userImageUrl = this.authService.getImageUrlFromToken(res.AccessToken) || 'defaultImageUrl';
      this.userName = this.authService.getUserNameFromToken(res.AccessToken) || 'Anonymous User';
      this.userRole=this.authService.getUserRoleFromToken(res.AccessToken) || 'Unknown';
      // this.authService.getUserRole().subscribe(role => {
      //   this.userRole = role;
      // });
      this.isLoggedIn=this.authService.isLoggedInSync();
      if(this.login.email){
        this.authService.setUserEmail(this.login.email);
      }
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
goToAdminPage():void{
  this.router.navigate(['/doctorsList']);
}
goToUserPage():void{
  this.authService.getUserEmail().subscribe(email => {
    this.router.navigate(['/userPage', email]);
  });
}


closeLoginForm() {
  this.showLoginForm = false;
}


logout():void{
  this.authService.logout();
  this.showAuth=true;
}


}
