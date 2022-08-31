import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketService } from './socket.service';
import { IonContent } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
})
export class ChatPage {
  @ViewChild('chatWindow') chatWindow: IonContent;
  hideTime = true;
  messageList: any[] = [];
  ioConnection: any;
  message;
  messages: { text: string | number; time: string }[];
  data: { message: string; time: string };
  constructor(private socketService: SocketService, public authService: AuthService) {}
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
      .subscribe((message: {message: string, time: Date, user: string}) => {
        this.messageList.push({message: message.message, 
          time: `${new Date(message.time).getDate()}-${new Date(message.time).getMonth()}-${new Date(message.time).getFullYear().toString().slice(2,4)}`, 
          timeVisible: false, user: message.user});
          this.chatWindow.scrollToBottom()

      });
  }
}
