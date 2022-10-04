import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SocketService } from '../shared/services/socket.service';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem'
import { HttpService } from '../shared/services/http.service';


@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy,AfterViewInit {
  @ViewChild('chatWindow') chatWindow: IonContent;
  hideTime = true;
  groupname;
  messageList: any[] = [];
  ioConnection: any;
  message;
  roomid;
  roomname;
  routeSub: Subscription;
  joinNotifSub: Subscription;
  leaveNotifSub: Subscription;
  messages: { text: string | number; time: string }[];
  data: { message: string; time: string };
  user;
  constructor(private socketService: SocketService, private httpService: HttpService, public authService: AuthService, private activatedRoute: ActivatedRoute, private loadingCtrl: LoadingController) {
  }
  /**
   * If the text is not empty, then send the message to the socket service
   * @param {any} text - The text to be sent to the server.
   */
  sendMessage(text: any) {
    if (text) {
      this.socketService.sendMessage(text, this.roomid);
    }
  }
  /**
   * The function is called when the component is initialized. It calls the initIoConnection()
   * function.
   */
  async ngOnInit() {
    this.user = this.authService.getUser()
    this.routeSub = this.activatedRoute.params.subscribe((params)=>{
      this.groupname = params.groupname
      this.roomid = params.id
      this.roomname = params.name
    })
    this.initIoConnection();
    await this.loadCache()
  }
  ngAfterViewInit(): void {
    this.socketService.joinRoom(this.roomid)
    console.log('joinCalled')
  }

  ngOnDestroy() {
    this.socketService.leaveRoom(this.roomid, this.user)
    this.ioConnection.unsubscribe()
    this.routeSub.unsubscribe()
    this.joinNotifSub.unsubscribe()
    this.leaveNotifSub.unsubscribe()

  }
  /**
   * This function is called when the user clicks the send button, and it pushes the message to the
   * messageList array, which is then displayed in the chat window.
   */
  private initIoConnection() {
    this.socketService.initSocket();
    console.log('initialising')
    this.ioConnection = this.socketService
      .getMessage()
      .subscribe((message: {message: string, time: Date, user: string, img: string}) => {
        this.messageList.push({message: message.message, 
          time: `${new Date(message.time).getDate()}-${new Date(message.time).getMonth()}-${new Date(message.time).getFullYear().toString().slice(2,4)}`, 
          timeVisible: false, user: message.user, img: message.img ? message.img : null});
          this.chatWindow.scrollToBottom()
      });

      this.joinNotifSub = this.socketService.getJoinNotifications().subscribe((joinMsg: string)=>{
        if (!joinMsg.includes(JSON.parse(sessionStorage.getItem('savedUser')).username)){
        this.messageList.push({message: joinMsg, time: new Date(Date.now()), timeVisible: false, user: "System Message"})
        this.chatWindow.scrollToBottom()
        }
      })
      this.leaveNotifSub = this.socketService.getLeaveNotifications().subscribe((leaveMsg)=>{
        this.messageList.push({message: leaveMsg, time: new Date(Date.now()), timeVisible: false, user: "System Message"})
        this.chatWindow.scrollToBottom()

      })
  }

  avatarDirectory(filename){
    return this.httpService.URL+ 'images/' + filename
  }

  async loadCache(){
    const IMAGE_DIR = 'profile-img-cache'
    const loading = await this.loadingCtrl.create({
      message: 'Loading data...'
    });
    await loading.present()
    Filesystem.readdir({
      directory: Directory.Cache,
      path: IMAGE_DIR
    }).then(result => {
    }, async err => {
      console.log('error ', err)
      await Filesystem.mkdir({
        directory: Directory.Cache,
        path: IMAGE_DIR
      })
    }).then(_ => {
      loading.dismiss()
    })
  }
  

  /**
   * The logout function is called when the user clicks the logout button. The logout function calls
   * the logout function in the auth service
   */
  logout(){
    this.authService.logout()
  }

  /**
   * It returns the role of the user from the authService.
   * @returns The function getRole() is being returned.
   */
  checkRole(){
    return this.authService.getRole()
  }
}
