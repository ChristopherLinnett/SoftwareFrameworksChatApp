import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket.service';
@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
})
export class ChatPage {
  hideTime = true;
  messageList: any[] = [];
  ioConnection: any;
  message;
  messages: { text: string | number; time: string }[];
  data: { message: string; time: string };
  constructor(private socketService: SocketService) {}
  sendMessage(text: any) {
    if (text) {
      this.socketService.sendMessage(text);
    }
  }
  ngOnInit() {
    this.initIoConnection();
  }
  private initIoConnection() {
    this.socketService.initSocket();
    this.ioConnection = this.socketService
      .getMessage()
      .subscribe((message: {message: string, time: Date}) => {
        this.messageList.push({message: message.message, time: String(new Date(message.time).toTimeString().slice(0,8)), timeVisible: false});
      });
  }
}
