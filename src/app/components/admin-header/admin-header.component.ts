import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {


constructor(
  private messageService:MessageService,
  private authService:AuthService
){}

isAdmin:boolean=false;
checkRole():void{
  if(this.authService.isAdmin()){
    this.isAdmin=true;
  }
}

}

