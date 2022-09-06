import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  usertypes = ['user', 'groupuser', 'superuser'];
  currentState = 'unchecked';
  queryUser: { username: string; email: string; id: string; role: string };
  secondaryInput = 'username';
  @ViewChild('userToCheck') input1;
  @ViewChild('input2') input2;
  @ViewChild('title') title;
  constructor(private httpClient: HttpClient, private alertController: AlertController, private authService: AuthService) {}

  ngOnInit() {}

  resetform() {
    this.currentState = 'unchecked';
    this.queryUser = undefined;
    this.secondaryInput = 'username';
    this.input1.value = '';
    this.input2.value = '';
    this.title.el.textContent= 'User Management'
  }

  updateRole() { 
    console.log(this.queryUser.id)
    this.httpClient
    .post<any>('http://localhost:3000/admin/updaterole', { username: this.queryUser.username, oldRole: this.queryUser.role, newRole: this.input2.value, userId:this.queryUser.id })
    .subscribe((res: { success: Boolean }) => {
      res.success ? this.presentAlert('Success', `${this.queryUser.username} has been updated`) : console.log('did not delete');
      this.resetform()
    });
}

  checkUser(user): void {
    if (user!= this.authService.getUser()){
    this.httpClient
      .post<any>('http://localhost:3000/admin/usercheck', {
        username: user.toLowerCase(),
      })
      .subscribe(
        (res: {
          username: string;
          id: string;
          email: string;
          role: string;
          validUser: boolean;
        }) => {
          if (res.validUser) {
            this.currentState = 'deleteMode';
            this.queryUser = {
              username: res.username,
              email: res.email,
              id: res.id,
              role: res.role,
            };
            this.title.el.textContent =
              this.queryUser['username'].toLocaleUpperCase();
            this.input1.value = this.queryUser['email'];
            this.input2.value = this.queryUser['role'];
            sessionStorage.setItem('savedUser', JSON.stringify(res));
          } else {
            this.currentState = 'createMode';
            if (!user.includes('@')) {
              this.secondaryInput = 'email';
            }
          }
        }
      );
    } else {
      this.presentAlert('Invalid Action', 'You cannot modify your own credentials')
      this.resetform()
    }
  }
  async upgradeUser(direction) {
    this.currentState='roleChange'
    var currentLevel = this.usertypes.indexOf(this.input2.value);
    console.log(currentLevel)
    if ((direction == '+' && currentLevel < this.usertypes.length-1)) {
      this.input2.value = this.usertypes[currentLevel + 1];
    }
    if ((direction == '-' && currentLevel > 0)) {
      this.input2.value = this.usertypes[currentLevel - 1];
    }
    if (this.input2.value == this.queryUser.role){
      this.currentState='deleteMode'
    }
  }
  async deleteUser() {
    await this.httpClient
      .post<any>('http://localhost:3000/admin/deleteuser', { user: this.title.el.textContent.toLowerCase() })
      .subscribe((res: { success: Boolean }) => {
        res.success ? this.presentAlert('Success', `${this.queryUser.username} has been deleted`) : console.log('did not delete');
        this.resetform()
      });
  }

  async presentAlert(title, message) {
    const alert = await this.alertController.create({
      header: title,
      buttons: ['OK'],
      message: message
    });

    await alert.present();
  }


  async createUser(input1, input2) {
    var newUser; 
    if (this.secondaryInput == 'email') {
      newUser = { username: input1.toLowerCase(), email: input2.toLowerCase() };
    } else {
      newUser = { username: input2.toLowerCase(), email: input1.toLowerCase() };
    }
    await this.httpClient
      .post<any>('http://localhost:3000/admin/newuser', newUser)
      .subscribe((res: { success: Boolean }) => {
        if (res.success){
          this.presentAlert('Success', `${newUser.username} has been created`)
        }
        this.resetform();
      });
  }
}
