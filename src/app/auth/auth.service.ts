import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  loggedIn = false;
  savedUser : {username: string, id: string, email: string, role: string, access: any};
    constructor(private httpClient: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) { }
    
  
    /**
     * It takes two inputs, sends them to the server, and if the server returns a successful login, it
     * sets the loggedIn variable to true, saves the user's details in the savedUser variable, and
     * navigates to the home page.
     * @param usernameInput - string
     * @param passwordInput - string
     */
    login(usernameInput, passwordInput): void {
      this.httpClient.post<any>('http://192.168.8.95:3000/auth', 
      {username: usernameInput.toLowerCase(), password: passwordInput.toLowerCase() }).subscribe((res: {username: string, id: string, email: string, role: string, access: any, loginSuccess: boolean}) => {
        if (res.loginSuccess) {
            this.loggedIn = true;
            this.savedUser = {username: res.username, email: res.email, id: res.id, role: res.role, access: res.access}
            sessionStorage.setItem('savedUser', JSON.stringify(res));
            console.log(res.access)
          }
          this.loggedIn ? this.router.navigate(['']) : alert("incorrect details, try again");
      });      
}
  getSavedUser(){
    return this.savedUser
  }

  /**
   * The logout function clears the user object, sets the loggedIn variable to false, clears the
   * local storage, and navigates to the auth route
   */
  logout() {
    this.savedUser = null;
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
    return this.savedUser.username
  }

  /**
   * It returns the role of the user.
   * @returns The savedUser.role property.
   */
  getRole(): string {
    return this.savedUser.role
  }
}
