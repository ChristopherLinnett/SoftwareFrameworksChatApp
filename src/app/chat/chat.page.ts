import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SocketService } from '../shared/services/socket.service';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem'
import { HttpService } from '../shared/services/http.service';
import { ImageService } from '../shared/services/image.service';
import { VideocallmodalComponent } from './videocallmodal/videocallmodal.component';

const IMAGE_DIR = 'image-storage'

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
  imageConnection: any;
  message;
  roomid;
  image;
  roomname;
  routeSub: Subscription;
  joinNotifSub: Subscription;
  leaveNotifSub: Subscription;
  messages: { text: string | number; time: string }[];
  data: { message: string; time: string };
  user;
  constructor(private router: Router, private socketService: SocketService, private httpService: HttpService, public authService: AuthService, private activatedRoute: ActivatedRoute, private modalController: ModalController, private imageService: ImageService) {
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

  sendImage() {
    if (this.image){
      this.imageService.startUpload(this.image,true, this.roomid)
      this.deleteImage()
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
  }
  ngAfterViewInit(): void {
    this.socketService.joinRoom(this.roomid)
    console.log('joinCalled')
  }

  async launchVideoChat(userid){
    // const modal = await this.modalController.create({
    //   component: VideocallmodalComponent,
    //   componentProps: { 
    //     recipient: userid
    //   }
    // });
    // modal.present();
    this.router.navigate(['video-chat'], userid)
  }

  ngOnDestroy() {
    this.socketService.leaveRoom(this.roomid, this.user)
    this.ioConnection.unsubscribe()
    this.routeSub.unsubscribe()
    this.joinNotifSub.unsubscribe()
    this.leaveNotifSub.unsubscribe()
    if (this.image){
      this.image = null
      this.deleteImage()
    }

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
      .subscribe((message: {message: string, time: Date, user: string, userid: string, img: string}) => {
        this.messageList.push({message: message.message, 
          time: `${new Date(message.time).getDate()}-${new Date(message.time).getMonth()}-${new Date(message.time).getFullYear().toString().slice(2,4)}`, 
          timeVisible: false, user: message.user, userid: message.userid, img: message.img ? message.img : null});
          this.chatWindow.scrollToBottom()
      });


      this.imageConnection = this.socketService.getImage().subscribe((message: {imgFile: string, time: Date, user: string, img: string}) => {
        console.log(message)
        this.messageList.push({messageImg: message.imgFile, time: `${new Date(message.time).getDate()}-${new Date(message.time).getMonth()}-${new Date(message.time).getFullYear().toString().slice(2,4)}`, timeVisible: false, user: message.user, img: message.img ? message.img : null});
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

  checkMessage(message,prevMessage,i){
    if (message.img == undefined){
      return false
    }
    if (i<1 || message.user != prevMessage.user){
      return true
    }
    return false
    
  }

  avatarDirectory(filename){
    if (filename == undefined){
      return ''
    }
    if (filename == 'None'){
      return './assets/icon/nouserimage.png'
    }
    return this.httpService.URL + 'images/' + filename
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

  async selectImage() {
    await this.imageService.selectImage()
    setTimeout(()=>this.loadFiles(), 100)
   }
 
   async loadFiles() {
     Filesystem.readdir({
       directory: Directory.Data,
       path: IMAGE_DIR
     }).then(result => {
       this.loadFileData(result.files[0])
     }, async err => {
       console.log('error ', err)
       await Filesystem.mkdir({
         directory: Directory.Data,
         path: IMAGE_DIR
       })
     })
   }
   async loadFileData(file){
       const fileName = file.name
       const filePath = `${IMAGE_DIR}/${fileName}`
       const readFile = await Filesystem.readFile({
         directory: Directory.Data,
         path: filePath
       })
       this.image = {
         name: fileName,
         path: filePath,
         data: `data:image/jpeg;base64,${readFile.data}`
     }
   }
   async deleteImage(){
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: IMAGE_DIR+ '/temp.jpeg'
    })
    this.image = null
  }
getImg(filename){
  return this.httpService.URL + 'images/' + filename
}


}
