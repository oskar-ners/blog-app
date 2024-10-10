import { Component } from '@angular/core';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [LogoutButtonComponent, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {}
