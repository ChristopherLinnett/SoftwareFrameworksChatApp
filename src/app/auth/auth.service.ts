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

  logout() {
    this.user = null;
    this.loggedIn = false;
    sessionStorage.clear();
    this.router.navigate(['/auth']);
  }
  isLogged(): boolean {
    return this.loggedIn
  }
  getUser(): string {
    return this.user
  }
}
