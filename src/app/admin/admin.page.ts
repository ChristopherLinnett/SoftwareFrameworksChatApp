import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
currentState = "unchecked";
queryUser: {username: string, email: string, id: string};
secondaryInput = "username"
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  checkUser(user): void {
    this.httpClient.post<any>('http://localhost:3000/admin/usercheck', 
    {username: user.toLowerCase()}).subscribe((res: {username: string, id: string, email: string, validUser: boolean}) => {
      console.log(res)
      if (res.validUser) {
          this.currentState = "deleteMode"
          this.queryUser = {username: res.username, email: res.email, id: res.id}
          sessionStorage.setItem('savedUser', JSON.stringify(res));
        } else {
        this.currentState = "createMode"
        if (!user.includes("@")){
          this.secondaryInput = "email"
        }
      }
    });      
}

createUser(input1,input2){
  console.log('buton pressed')
  var newUser;
  if (this.secondaryInput == 'email'){
    newUser = {username: input1.toLowerCase(), email: input2.toLowerCase()}
  }
    else {
      newUser = {username: input2.toLowerCase(), email: input1.toLowerCase()}
    }
    console.log(newUser)
    this.httpClient.post<any>('http://localhost:3000/admin/newuser', 
    newUser).subscribe((res: {success: Boolean}) => {
      res.success ? console.log("added new user") : console.log('failed')
  })
}
}
