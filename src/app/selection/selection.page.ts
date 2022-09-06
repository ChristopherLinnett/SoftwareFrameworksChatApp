import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.page.html',
  styleUrls: ['./selection.page.scss'],
})
export class SelectionPage implements OnInit {
  groups: any[];
  constructor() {}

 async ngOnInit() {
  var wholeUser = await JSON.parse(sessionStorage.getItem('savedUser'))
  this.groups = wholeUser.access.groups
  console.log('groups',this.groups)
  console.log('rooms',this.groups[0].rooms)
  }
}
