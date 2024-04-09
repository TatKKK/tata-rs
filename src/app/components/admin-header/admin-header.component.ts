import { Component , OnInit} from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent  implements OnInit {


constructor(
  private messageService:MessageService,
  private authService:AuthService
){}

ngOnInit(): void {
  
   
  
}

isAdmin:boolean=false;


}

