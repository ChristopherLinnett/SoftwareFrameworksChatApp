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

  /**
   * The login function takes two parameters, usernameInput and passwordInput, and converts them to
   * strings before passing them to the authService.login function
   * @param {string|number} usernameInput - string|number
   * @param {string|number} passwordInput - string|number
   */
  login(usernameInput: string|number, passwordInput: string|number) {
    this.authService.login(usernameInput.toString(), passwordInput.toString())
  }
}
