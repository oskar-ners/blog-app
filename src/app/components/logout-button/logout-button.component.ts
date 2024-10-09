import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [],
  template: `<button (click)="logout()">Logout</button>`,
})
export class LogoutButtonComponent {
  authService = inject(AuthService);
  router = inject(Router);

  async logout(): Promise<void> {
    await this.authService.signOut();
    this.router.navigateByUrl('/login');
  }
}
