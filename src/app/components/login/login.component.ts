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
  userId: number | null = null;
  userRole: string = '';
  login: Login = new Login();
  // token: string = "";
  isLoggedIn: boolean = false;
  showLoginForm = false;
  userName: string = '';
  userImageUrl: string = '';
  userRole$: Observable<'patient' | 'doctor' | 'admin' | 'unknown'>;
  userImageUrl$: Observable<string>;
  showAuth:boolean=false;
  isLoggedIn$: Observable<boolean>;

  private destroy$ = new Subject<void>();



  constructor(
    private router: Router, 
    private authService: AuthService
  ) {
    this.userRole$ = this.authService.getUserRole();
    this.userImageUrl$ = this.authService.getImageUrl();
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedInStatus => {
      this.isLoggedIn = loggedInStatus;
      if (this.isLoggedIn) {
        this.showAuth = false;
      } else {
        this.showAuth = true;
      }
    });
    this.userRole$.pipe(takeUntil(this.destroy$)).subscribe(role => {
      this.userRole = role;
      this.isLoggedIn = role !== 'unknown';
      if (this.isLoggedIn) {
        this.showLoginForm = false;
      }
    });

    this.userRole = this.authService.getUserRoleSync();

    this.userImageUrl$.pipe(takeUntil(this.destroy$)).subscribe(imageUrl => {
      this.userImageUrl = imageUrl || 'defaultImageUrl';
    });
  
  }


  authenticate(): void {
       this.authService.authenticate(this.login).subscribe({
        next: (res) => {
          console.log(res);
          console.log(res.AccessToken);
            if (!res || !res.AccessToken) {
                console.error('Login failed: No user data returned');
                this.isLoggedIn = false;
                return; 
            }            
            this.isLoggedIn = true;
            this.showLoginForm = false;
            this.routeBasedOnUserRole();
        },
        error: (err) => {
            console.error('Login error:', err);
            this.isLoggedIn = false;
        }
    });
}

private routeBasedOnUserRole(): void {
    if (this.userRole === 'admin') {
      this.router.navigate(['/doctorsList']);
    } else {
        this.routeUser();
    }
}

private routeUser(): void {
  const userIdString = localStorage.getItem('userId');
  console.log('Retrieved User ID from localStorage:', userIdString);

  if (userIdString) {
    this.userId = parseInt(userIdString, 10);
    this.router.navigate(['/userPage', this.userId]);
  } else {
    console.error('No userId found in localStorage');
  }
}


goToAdminPage(): void {
  this.router.navigate(['/doctorsList']);
}

goToUserPage(): void {
  const userIdString = localStorage.getItem('userId');
  this.userId = userIdString !== null ? parseInt(userIdString, 10) : null;
 
  if (this.userId) {
    this.router.navigate(['/userPage',this.userId]);
  } else {
    console.error('No userId found in localStorage');
  }
}

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
  }
closeLoginForm():void{
  this.showLoginForm=false;
}
  toggleLoginForm(): void {
    this.showLoginForm = !this.showLoginForm;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
}