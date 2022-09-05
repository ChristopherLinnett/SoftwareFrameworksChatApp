import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
currentState = "unchecked";
queryUser: {username: string, email: string, id: string};
secondaryInput = "username"
@ViewChild('userToCheck') input1;
@ViewChild('input2') input2;
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  resetform(){
    this.currentState="unchecked"
    this.queryUser = undefined
    this.secondaryInput = "username"
    this.input1.value = ''
    this.input2.value = ''
  }

  checkUser(user): void {
    this.httpClient.post<any>('http://localhost:3000/admin/usercheck', 
    {username: user.toLowerCase()}).subscribe((res: {username: string, id: string, email: string, validUser: boolean}) => {
      if (res.validUser) {
          this.currentState = "deleteMode"
          this.queryUser = {username: res.username, email: res.email, id: res.id}
          this.input1.value=this.queryUser['username']
          this.input2.value=this.queryUser['email']
          sessionStorage.setItem('savedUser', JSON.stringify(res));
        } else {
        this.currentState = "createMode"
        if (!user.includes("@")){
          this.secondaryInput = "email"
        }
      }
    });      
}

deleteUser(user){
  this.httpClient.post<any>('http://localhost:3000/admin/deleteuser', 
    {user: user}).subscribe((res: {success: Boolean}) => {
      this.resetform()
  })
}

createUser(input1,input2){
  var newUser;
  if (this.secondaryInput == 'email'){
    newUser = {username: input1.toLowerCase(), email: input2.toLowerCase()}
  }
    else {
      newUser = {username: input2.toLowerCase(), email: input1.toLowerCase()}
    }
    this.httpClient.post<any>('http://localhost:3000/admin/newuser', 
    newUser).subscribe((res: {success: Boolean}) => {
      this.resetform()
  })
}

}
