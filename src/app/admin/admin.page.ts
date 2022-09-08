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
  role: string;
  usertypes = ['user', 'groupuser', 'superuser'];
  currentState = 'unchecked';
  queryUser: { username: string; email: string; id: string; role: string };
  queryPath: {
    name: string;
    id: string;
    rooms: { name: string; id: string }[];
  }[];
  totalPath: any = [];
  addGroup = false;
  editGroup = false

  secondaryInput = 'username';
  @ViewChild('userToCheck') input1;
  @ViewChild('input2') input2;
  @ViewChild('title') title;
  constructor(
    private httpClient: HttpClient,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  /**
   * It gets the role of the user from the authService and then it gets the groups from the server.
   */
  ngOnInit() {
    this.role = this.authService.getRole();
    var httpSub = this.httpClient
      .get<any>('http://localhost:3000/admin/getgroups')
      .subscribe(
        (res: { name: string; rooms: { name: string; id: string }[] }[]) => {
          this.totalPath = res;
        }
      );
  }

  deleteRoom(groupid,roomid){
    this.httpClient
      .post<any>('http://localhost:3000/admin/newordeleteroom', {
        roomname: 'nil', groupid: groupid, roomid: roomid, add: false
      })
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.ngOnInit();
        } else {
          console.log('bad response');
        }
      });
  }
  createRoom(groupid, name){
    this.httpClient
      .post<any>('http://localhost:3000/admin/newordeleteroom', {
        roomName: name, channelid: '1', groupid, add: true
      })
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.ngOnInit();
        } else {
          console.log('bad response');
        }
      });
  }

  deleteGroup(id){
    this.httpClient
      .post<any>('http://localhost:3000/admin/newordeletegroup', {
        groupName: 'nil', id: id, add: false
      })
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.ngOnInit();
          this.addGroup = false;
        } else {
          console.log('bad response');
        }
      });
  }

  createGroup(name){
      this.httpClient
        .post<any>('http://localhost:3000/admin/newordeletegroup', {
          groupName: name, id: '1', add: true
        })
        .subscribe((res: { success: Boolean }) => {
          if (res.success) {
            this.ngOnInit();
            this.addGroup = false;
          } else {
            console.log('bad response');
          }
        });
    }

  /**
   * If the queryPath is not empty, then check if the group id is in the queryPath. If it is, return
   * true. If it's not, return false.
   * @param group - the group that is being checked
   * @returns a boolean value.
   */
  checkGroup(group) {
    if (!this.queryPath) {
      return false;
    }
    let queryGroups = this.queryPath.map((group) => {
      return group.id;
    });
    if (queryGroups.includes(group.id)) {
      return true;
    }
    return false;
  }

  /**
   * It resets the form to its initial state.
   */
  resetform() {
    this.currentState = 'unchecked';
    this.queryUser = undefined;
    this.secondaryInput = 'username';
    this.input1.value = '';
    this.input2.value = '';
    this.title.el.textContent = 'User Management';
    this.queryPath = undefined;
  }

  /**
   * It takes in a username, groupid, and a boolean value. It then sends a post request to the server
   * with the username, groupid, and boolean value. If the response is successful, it calls the
   * checkUser function.
   * @param username - the username of the user you want to add/remove
   * @param groupid - the id of the group
   * @param addTrue - boolean
   */
  addRemoveGroup(username, groupid, addTrue) {
    console.log(username, groupid, addTrue);
    this.httpClient
      .post<any>('http://localhost:3000/admin/inviteremoveuser', {
        username: username,
        id: groupid,
        add: addTrue,
      })
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.checkUser(username);
        } else {
          console.log('bad response');
        }
      });
  }

  /**
   * It takes the user's id, username, and role from the form, and sends it to the server to update the
   * user's role.
   */
  updateRole() {
    console.log(this.queryUser.id);
    this.httpClient
      .post<any>('http://localhost:3000/admin/updaterole', {
        username: this.queryUser.username,
        oldRole: this.queryUser.role,
        newRole: this.input2.value,
        userId: this.queryUser.id,
      })
      .subscribe((res: { success: Boolean }) => {
        res.success
          ? this.presentAlert(
              'Success',
              `${this.queryUser.username} has been updated`
            )
          : console.log('did not delete');
        this.resetform();
      });
  }

  /**
   * It checks if the user exists in the database, if it does, it sets the currentState to deleteMode,
   * if it doesn't, it sets it to createMode.
   * @param user - string - the username of the user to be checked
   */
  checkUser(user): void {
    if (user.length > 2 && user != this.authService.getUser()) {
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
            access: {
              groups: {
                name: string;
                id: string;
                rooms: { name: string; id: string }[];
              }[];
            };
          }) => {
            if (res.validUser) {
              this.currentState = 'deleteMode';
              this.queryUser = {
                username: res.username,
                email: res.email,
                id: res.id,
                role: res.role,
              };
              this.queryPath = res.access.groups;
              this.title.el.textContent =
                this.queryUser['username'].toLocaleUpperCase();
              this.input1.value = this.queryUser['email'];
              this.input2.value = this.queryUser['role'];
              console.log(this.queryPath);
            } else {
              this.currentState = 'createMode';
              if (!user.includes('@')) {
                this.secondaryInput = 'email';
              }
            }
          }
        );
    } else {
      this.presentAlert(
        'Invalid Action',
        user.length > 2
          ? 'You cannot modify your own credentials'
          : 'The entered name is too short'
      );
      this.resetform();
    }
  }

  /**
   * It takes a string as an argument, and if the string is '+', it increments the value of the
   * input2.value property by one, and if the string is '-', it decrements the value of the
   * input2.value property by one.
   *
   * The input2.value property is a string that is the name of a role in a database.
   * @param direction - + or -
   */
  async upgradeUser(direction) {
    this.currentState = 'roleChange';
    var currentLevel = this.usertypes.indexOf(this.input2.value);
    if (direction == '+' && currentLevel < this.usertypes.length - 1) {
      this.input2.value = this.usertypes[currentLevel + 1];
    }
    if (direction == '-' && currentLevel > 0) {
      this.input2.value = this.usertypes[currentLevel - 1];
    }
    if (this.input2.value == this.queryUser.role) {
      this.currentState = 'deleteMode';
    }
  }

  /**
   * It sends a post request to the server with the username of the user to be deleted, and if the
   * server responds with a success message, it will display an alert to the user, and reset the form.
   */
  async deleteUser() {
    await this.httpClient
      .post<any>('http://localhost:3000/admin/deleteuser', {
        user: this.title.el.textContent.toLowerCase(),
      })
      .subscribe((res: { success: Boolean }) => {
        res.success
          ? this.presentAlert(
              'Success',
              `${this.queryUser.username} has been deleted`
            )
          : console.log('did not delete');
        this.resetform();
      });
  }

  /**
   * This function creates an alert with the title and message passed to it, and then presents it.
   * @param title - The title of the alert.
   * @param message - The message to display in the alert.
   */
  async presentAlert(title, message) {
    const alert = await this.alertController.create({
      header: title,
      buttons: ['OK'],
      message: message,
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
        if (res.success) {
          this.presentAlert('Success', `${newUser.username} has been created`);
        }
        this.resetform();
      });
  }
}
