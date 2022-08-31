import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login(usernameInput: string|number, passwordInput: string|number) {
    this.authService.login(usernameInput.toString(), passwordInput.toString())
  }
}