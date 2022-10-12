import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import io from 'socket.io-client';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  SERVER_URL;
  private socket: any;
  constructor(private httpService: HttpService){
    this.SERVER_URL = this.httpService.getURL()

  }

/**
 * The function returns a function that disconnects the socket
 * @returns A function that will disconnect the socket.
 */
initSocket() {
  this.socket = io(this.SERVER_URL);
  return ()=> {this.socket.disconnect();}
}

  /**
   * The function takes a string as an argument, and emits a message event to the server, with the
   * message text and the username of the user who sent the message
   * @param {string} messageText - The message that the user wants to send.
   */
  sendMessage(messageText: string, roomid) {

    this.socket.emit('message', {message: messageText, user: JSON.parse(sessionStorage.getItem('savedUser')).username,userid:JSON.parse(sessionStorage.getItem('savedUser')).id, roomid: roomid})
    }

  sendImage(filename: string, roomid) {
      this.socket.emit('image', {filename: filename, user: JSON.parse(sessionStorage.getItem('savedUser')).username, roomid: roomid})
      }

  sendChatReq(recipient: string, roomid){
    this.socket.emit('chatReq', {user: JSON.parse(sessionStorage.getItem('savedUser')).username,userid:JSON.parse(sessionStorage.getItem('savedUser')).id, roomid: roomid, recipient: recipient})
  }
  confirmChat(confirmer: string, requester: string, roomid: string){
    this.socket.emit('confirmChat', {confirmer: confirmer, requester: requester, roomid: roomid})
  }
  getConfirmChat(){
    return new Observable(observer=>{
      this.socket.on('confirmChat', (data: any)=> {observer.next(data)})
    })
  }
  joinRoom(roomid){
    this.socket.emit('joinroom', {roomid: roomid, username: JSON.parse(sessionStorage.getItem('savedUser')).username})
  }
  leaveRoom(roomid,username){
    this.socket.emit('leaveroom',{roomid: roomid, username: username})
  }
  getImage(){
    return new Observable(observer=>{
      this.socket.on('imageMessage',(data: any)=> {observer.next(data)})
    })
  }
  getChatReq(){
    return new Observable(observer=>{
      this.socket.on('chatReq', (data: any)=> {observer.next(data)})
    })
  }
  getChatConfirm(){
    return new Observable(observer=>{
      this.socket.on('confirmChat', (data: any)=> {observer.next(data)})
    })
  }

  getJoinNotifications(){
    return new Observable(observer=>{
      this.socket.on("joinnotify",(joinMsg: string)=>{observer.next(joinMsg)})
    })
  }
  getLeaveNotifications(){
    return new Observable(observer=>{
      this.socket.on("leavenotify",(leaveMsg: string)=>{observer.next(leaveMsg)})
    })
  }
    
  /**
   * The function returns an observable that listens for a message event from the server and then emits
   * the data received from the server
   * @returns An observable that listens for a message from the server.
   */
  getMessage() {
    return new Observable(observer=>{
      this.socket.on('message', (data: any) => {observer.next(data)
      });
    });
  }
}