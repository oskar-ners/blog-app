import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  authService = inject(AuthService);
  auth = inject(Auth);

  user: any;
  photoURL: string | null = null;

  async ngOnInit() {
    const uid = this.auth.currentUser?.uid;
    if (uid) {
      this.user = await this.authService.getUserData(uid);
      this.photoURL = this.user?.photoURL || null;
    }
  }
}
