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

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: "Error",
      buttons: ['OK'],
      message: message,
    });

    await alert.present();
  }

  getRoomUsers(){
    var httpSub = this.httpClient
      .post<any>('http://192.168.8.95:3000/admin/getroomusers', {groupid: this.groupid, roomid: this.roomid})
      .subscribe(
        (res) => {
          this.roomUsers = res});
        }

  }
