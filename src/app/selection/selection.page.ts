import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { AssistantModalComponent } from './assistant-modal/assistant-modal.component';

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
    private router: Router,
    private modalController: ModalController
  ) {}

  /**
   * The logout function is called when the user clicks the logout button. The logout function calls
   * the logout function in the auth service
   */
  logout(){
    this.authService.logout()
  }

  navigateaway(){
    this.router.navigate(['/chat']);
  }


  async ngOnInit() {
    this.checkUser();
  }

  /**
   * The function checks the role of the user and returns it
   * @returns The role of the user.
   */
  checkRole(){
    return this.authService.getRole()
  }

  /**
   * The function checks the user's access level and returns the groups that the user has access to
   */
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

  /**
   * This function checks if the user is an assistant of the group
   * @param groupid - the id of the group you want to check
   * @returns A boolean value.
   */
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

  /**
   * It sends a post request to the server with the roomid and groupid of the room to be deleted
   * @param groupid - the id of the group that the room is in
   * @param roomid - the id of the room to be deleted
   */
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


  /**
   * This function creates a modal, passes in the groupid, roomid, and roomname, and then presents the
   * modal
   * @param groupid - the id of the group
   * @param roomid - the id of the room you want to add the user to
   * @param roomname - The name of the room
   */
  async launchUserManager(groupid, roomid, roomname) {
    const modal = await this.modalController.create({
      component: AssistantModalComponent,
      cssClass: 'mymodal',
      componentProps: { 
        groupid: groupid,
        roomid: roomid,
        roomname: roomname
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

  }
 
  
  /**
   * This function is called when the user clicks the "Create Room" button. It sends a POST request to
   * the server with the room name, group id, and the user's username. The server then creates the room
   * and sends back a success message
   * @param groupid - the id of the group you want to add the room to
   * @param name - The name of the room
   */
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
