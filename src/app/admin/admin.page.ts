import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonAccordionGroup } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { Group } from '../shared/classes/accessPath';
import { HttpService } from '../shared/services/http.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  editMode: Boolean = false;
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
  editGroup = false;
  roomEdit = false;
  secondaryInput = 'username';
  @ViewChild('userToCheck') input1;
  @ViewChild('input2') input2;
  @ViewChild('title') title;
  @ViewChild('groupsAccordion') groupsAccordion: IonAccordionGroup;
  constructor(
    private httpService: HttpService,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  /**
   * It gets the role of the user from the authService and then it gets the groups from the server.
   */
  ngOnInit() {
    this.role = this.authService.getRole();
    var httpSub = this.httpService
      .getGroups()
      .subscribe(
        (res: { name: string; rooms: { name: string; id: string }[] }[]) => {
          this.totalPath = res;
          this.totalPath = this.totalPath.map((group) => {
            group[`editRoom`] = false;
            return group;
          });
        }
      );
  }

  /**
   * It sends a post request to the server with the roomid and groupid of the room to be deleted.
   * @param groupid - the id of the group that the room is in
   * @param roomid - the id of the room to be deleted
   */
  deleteRoom(groupid, roomid) {
    this.httpService
      .addOrDeleteRoom(null, groupid, roomid, false)
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.ngOnInit();
        } else {
          console.log('bad response');
        }
      });
  }

  /**
   * It sends a post request to the server with the room name and group id, and if the server responds
   * with a success message, it refreshes the page.
   * @param groupid - the id of the group that the room is being added to
   * @param name - the name of the room
   */
  createRoom(groupid, name) {
    this.httpService
      .addOrDeleteRoom(name, groupid, null, true, this.authService.getUser())
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.ngOnInit();
        } else {
          console.log('bad response');
        }
      });
  }

  /**
   * It sends a post request to the server with the group name and id, and the server deletes the group
   * from the database.
   * @param id - the id of the group
   */
  deleteGroup(id: string) {
    this.httpService
      .addOrDeleteGroup(null, id, false)
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.ngOnInit();
          this.addGroup = false;
        } else {
          console.log('bad response');
        }
      });
  }
  generateRoomUsers(roomUsers) {
    return roomUsers.includes(this.queryUser.id);
  }

  /**
   * It takes a groupid and a boolean, and sends a post request to the server with the userid, groupid,
   * and boolean.
   *
   * If the response is successful, it refreshes the page.
   *
   * If the response is unsuccessful, it logs an error.
   * @param groupid - the id of the group
   * @param add - true or false
   */
  addRemoveGroupAssist(groupid, add) {
    this.httpService
      .addOrDeleteGroupAssistant(this.queryUser.id, groupid, add)
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.ngOnInit();
        } else {
          console.log('bad response');
        }
      });
  }

  /**
   * It takes a string, sends it to the server, and then refreshes the page.
   * @param name - the name of the group
   */
  createGroup(name) {
    this.httpService
      .addOrDeleteGroup(name, null, true)
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
  addRemoveGroup(username, groupid, add) {
    this.httpService
      .addOrRemoveGroupUser(username, groupid, add)
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.checkUser(username);
        } else {
          console.log('bad response');
        }
      });
  }

  /**
   * It takes a username, groupid, roomid, and a boolean value.
   * It then sends a post request to the server with the given parameters.
   * If the server responds with a success message, it refreshes the page.
   * If the server responds with a failure message, it logs a message to the console.
   * @param username - username of the user you want to add/remove
   * @param groupid - the id of the group
   * @param roomid - the id of the room
   * @param addTrue - boolean
   */
  addRemoveRoom(username, groupid, roomid, add) {
    this.httpService
      .addOrDeleteRoomUser(username, this.queryUser.id, groupid, roomid, add)
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.ngOnInit();
          this.checkUser(this.queryUser.username);
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
    this.httpService
      .updateUserRole(
        this.queryUser.username,
        this.queryUser.role,
        this.input2.value,
        this.queryUser.id
      )
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
      this.httpService.verifyUser(user.toLowerCase()).subscribe(
        (res: {
          username: string;
          id: string;
          email: string;
          role: string;
          validUser: boolean;
          access: {
            groups: Group[];
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
   * If the user is an assistant in the group, return true, otherwise return false.
   * @param groupid - the id of the group
   * @returns A boolean value.
   */
  isGroupAssistant(groupid) {
    var userid = this.queryUser.id;
    var groupIDlist = this.totalPath.map((group) => {
      return group.id;
    });
    var groupIndex = groupIDlist.indexOf(groupid);
    // console.log(this.userPath[groupIndex])
    if (this.totalPath[groupIndex].assistants.includes(userid)) {
      return true;
    }
    return false;
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
  deleteUser() {
    this.httpService
      .addOrDeleteUser(String(this.title.el.textContext).toLowerCase(), false)
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

  /**
   * It takes two inputs, and depending on the value of a variable, it creates an object with the two
   * inputs in different properties, and then sends that object to a server.
   * @param input1 - the username
   * @param input2 - string;
   */
  async createUser(input1, input2) {
    var newUser;
    if (this.secondaryInput == 'email') {
      newUser = { username: input1.toLowerCase(), email: input2.toLowerCase() };
    } else {
      newUser = { username: input2.toLowerCase(), email: input1.toLowerCase() };
    }
    this.httpService
      .addOrDeleteUser(newUser, true)
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.presentAlert('Success', `${newUser.username} has been created`);
        }
        this.resetform();
      });
  }

  getValue(){
    return Array.from(
      Array(this.totalPath.length),
      (_, index) => String(index)
    );
  }
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.groupsAccordion.value = Array.from(
        Array(this.totalPath.length),
        (_, index) => String(index)
      );
    }

    // this.groupsAccordion.value = Array.from(this.totalPath.length)
  }
}
