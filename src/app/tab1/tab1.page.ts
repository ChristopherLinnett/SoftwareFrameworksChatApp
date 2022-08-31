import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  hideTime = true;
  message;
  messages: {text: string, time: string}[]
  data: {message: string, time: string}
    constructor() {}
  
    sendMessage(inputField){
      console.log(inputField)
    }
  
  }
  