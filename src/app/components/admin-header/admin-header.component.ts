import { Component} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {

  constructor(
    private authService:AuthService
  ){
  }

 get isAdmin(): boolean {
    return this.authService.isAdminSync();
  }

}

