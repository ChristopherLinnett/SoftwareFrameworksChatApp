import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-assistant-modal',
  templateUrl: './assistant-modal.component.html',
  styleUrls: ['./assistant-modal.component.scss'],
})
export class AssistantModalComponent implements OnInit {
roomid: string;
roomname: string;
groupid: string;
editUser: boolean = false;
roomUsers: {id: string, name: string}[]
  constructor(private httpClient: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
    this.getRoomUsers()
    console.log('opened')
    
  }

  /**
   * This function is used to add or remove a user from a room
   * @param username - The username of the user you want to add or remove
   * @param userid - The userid of the user you want to add or remove
   * @param groupid - the id of the group
   * @param roomid - the id of the room you want to add/remove the user from
   * @param addTrue - true if you want to add a user, false if you want to remove a user
   * @param i - the index of the user in the roomUsers array
   */
  addRemoveRoomUser(username, userid, groupid, roomid, addTrue, i) {
    this.httpClient
      .post<any>('http://192.168.8.95:3000/admin/inviteremoveroomuser', {
        username: username,
        userid: userid,
        groupid: groupid,
        roomid: roomid,
        add: addTrue,
      })
      .subscribe((res: { success: Boolean, userid: string, message: string }) => {
        if (res.success) {
          if (!addTrue){
          this.roomUsers.splice(i,1)
          } else {
            console.log(res)
            this.roomUsers.push({id: res.userid, name: username})
          }
        } else {
          this.presentAlert(res.message)
        }
      });
  }

  /**
   * This function creates an alert with a header of "Error" and a message of whatever is passed into
   * the function
   * @param message - The message you want to display in the alert.
   */
  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: "Error",
      buttons: ['OK'],
      message: message,
    });

    await alert.present();
  }

  /**
   * This function is called when the user clicks on a room in the list of rooms. It sends a post
   * request to the server with the groupid and roomid of the room that was clicked on. The server then
   * returns a list of users in that room
   */
  getRoomUsers(){
    var httpSub = this.httpClient
      .post<any>('http://192.168.8.95:3000/admin/getroomusers', {groupid: this.groupid, roomid: this.roomid})
      .subscribe(
        (res) => {
          this.roomUsers = res});
        }

  }
