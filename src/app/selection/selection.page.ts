import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.page.html',
  styleUrls: ['./selection.page.scss'],
})
export class SelectionPage implements OnInit {
  groups: any[];
  userPath;
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private router: Router
  ) {}
  logout(){
    this.authService.logout()
  }

  navigateaway(){
    console.log('testing')
    this.router.navigate(['/chat']);
  }

  async ngOnInit() {
    this.checkUser();
  }

  checkRole(){
    return this.authService.getRole()
  }

  checkUser(): void {
      this.httpClient
        .post<any>('http://192.168.8.95:3000/admin/usercheck', {
          username: this.authService.getUser().toLowerCase()
        })
        .subscribe(
          (res) => {
              this.userPath = res.access.groups.map((group)=>{
                group['editRoom'] = false; 
                return group})
          });
        }
  isGroupAssistant(groupid){
    var userid = this.authService.getSavedUser().id
    var groupIDlist = this.userPath.map((group)=>{return group.id})
    var groupIndex = groupIDlist.indexOf(groupid)
    // console.log(this.userPath[groupIndex])
    if (this.userPath[groupIndex].assistants.includes(userid)){
      return true
    }
    return false
  }

  deleteRoom(groupid,roomid){
    this.httpClient
      .post<any>('http://192.168.8.95:3000/admin/newordeleteroom', {
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
      .post<any>('http://192.168.8.95:3000/admin/newordeleteroom', {
        roomName: name, roomid: '1', groupid: groupid, add: true, creator: this.authService.getUser()
      })
      .subscribe((res: { success: Boolean }) => {
        if (res.success) {
          this.ngOnInit();
        } else {
          console.log('bad response');
        }
      });
  }

}
