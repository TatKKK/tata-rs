import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css'
})
export class ButtonsComponent {
  constructor(
    private router:Router
  ){}

  isUserPage(): boolean {
    return this.router.url.includes('/userPage/');
  }
}
