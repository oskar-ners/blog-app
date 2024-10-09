import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BlogComponent } from './components/blog/blog.component';
import { authGuard } from './guards/auth.guard';
import { authLoggedInGuard } from './guards/auth-logged-in.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authLoggedInGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authLoggedInGuard],
  },
  { path: 'blog', component: BlogComponent, canActivate: [authGuard] },
];
