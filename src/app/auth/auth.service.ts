import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  loggedIn = false;
  user;
  savedUser = {}
    constructor(private httpClient: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) { }
    
    /**
     * The function takes in two strings, usernameInput and passwordInput, and sends a post request to
     * the server with the username and password. If the login is successful, the user is saved to
     * session storage and the user is navigated to the home page
     * @param usernameInput - the username input from the login form
     * @param passwordInput - the password the user has entered
     */
    login(usernameInput, passwordInput): void {
      this.httpClient.post<any>('http://localhost:3000/auth', 
      {username: usernameInput.toLowerCase(), password: passwordInput.toLowerCase() }).subscribe((res: {username: string, id: string, email: string, loginSuccess: boolean}) => {
        if (res.loginSuccess) {
            this.loggedIn = true;
            this.savedUser = {username: res.username, email: res.email, id: res.id}
            sessionStorage.setItem('savedUser', JSON.stringify(res));
            this.user = res.username
          }
          this.loggedIn ? this.router.navigate(['']) : alert("incorrect details, try again");
      });      
}

  /**
   * The logout function clears the user object, sets the loggedIn variable to false, clears the
   * session storage, and navigates to the auth route
   */
  logout() {
    this.user = null;
    this.loggedIn = false;
    sessionStorage.clear();
    this.router.navigate(['/auth']);
  }
  /**
   * If the user is logged in, return true, otherwise return false
   * @returns A boolean value.
   */
  isLogged(): boolean {
    return this.loggedIn
  }
  /**
   * This function returns a string.
   * @returns The user property of the class.
   */
  getUser(): string {
    return this.user
  }
}
