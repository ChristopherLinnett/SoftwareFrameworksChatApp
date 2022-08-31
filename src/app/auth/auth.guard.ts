import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}
  canActivate(){
    if (this.authService.isLogged()){
      return true
    } else {
      this.router.navigate(['/auth'])
      return false
    };
  }
}
