import { Component, OnInit } from '@angular/core';
import { User } from '../shared/classes/User'
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
editMode: boolean = false;
user: User;
  constructor() {
    this.user = JSON.parse(sessionStorage.getItem("savedUser"))
  }
  toggleEditMode(){
    this.editMode= !this.editMode
  }
  ngOnInit() {
  }

}
