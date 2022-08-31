import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  loggedIn = false;
  savedUser = {}
    constructor(private httpClient: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) { }
    
    login(usernameInput, passwordInput): void {
      console.log(usernameInput,passwordInput);
      this.httpClient.post<any>('http://localhost:3000/auth', 
      {username: usernameInput.toLowerCase(), password: passwordInput.toLowerCase() }).subscribe((res: {username: string, id: string, email: string, loginSuccess: boolean}) => {
        if (res.loginSuccess) {
          console.log('message received')
            this.loggedIn = true;
            this.savedUser = {username: res.username, email: res.email, age: res.id}
            localStorage.setItem('savedUser', JSON.stringify(res));
          }
          this.loggedIn ? this.router.navigate(['']) : alert("incorrect details, try again");
      });      
}
  isLogged(): boolean {
    return this.loggedIn
  }

}
