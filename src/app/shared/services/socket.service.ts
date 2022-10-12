import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  SERVER_URL;
  private socket: any;
  constructor(private httpService: HttpService) {
    this.SERVER_URL = this.httpService.getURL();
  }

  /**
   * The function returns a function that disconnects the socket
   * @returns A function that will disconnect the socket.
   */
  /**
   * This function returns a function that disconnects the socket.
   * @returns A function that disconnects the socket.
   */
  initSocket() {
    this.socket = io(this.SERVER_URL);
    return () => {
      this.socket.disconnect();
    };
  }

  /**
   * The function takes a string as an argument, and emits a message event to the server, with the
   * message text and the username of the user who sent the message
   * @param {string} messageText - The message that the user wants to send.
   */
  sendMessage(messageText: string, roomid) {
    this.socket.emit('message', {
      message: messageText,
      user: JSON.parse(sessionStorage.getItem('savedUser')).username,
      userid: JSON.parse(sessionStorage.getItem('savedUser')).id,
      roomid: roomid,
    });
  }

  /**
   * It sends an image to the server, which then sends it to the roomid specified.
   * </code>
   * @param {string} filename - the name of the file
   * @param roomid - the id of the room the user is in
   */
  sendImage(filename: string, roomid) {
    this.socket.emit('image', {
      filename: filename,
      user: JSON.parse(sessionStorage.getItem('savedUser')).username,
      roomid: roomid,
    });
  }

  /**
   * This function emits a chatReq event to the server, which contains the username, userid, roomid,
   * and recipient of the chat request.
   * @param {string} recipient - the username of the person you want to chat with
   * @param roomid - the id of the room the user is in
   */
  sendChatReq(recipient: string, roomid) {
    this.socket.emit('chatReq', {
      user: JSON.parse(sessionStorage.getItem('savedUser')).username,
      userid: JSON.parse(sessionStorage.getItem('savedUser')).id,
      roomid: roomid,
      recipient: recipient,
    });
  }
  /**
   * When the user clicks the confirm button, emit a 'confirmChat' event to the server with the
   * confirmer, requester, and roomid as data.
   * @param {string} confirmer - the user who is confirming the chat
   * @param {string} requester - the user who requested the chat
   * @param {string} roomid - the room id of the chat room
   */
  confirmChat(confirmer: string, requester: string, roomid: string) {
    this.socket.emit('confirmChat', {
      confirmer: confirmer,
      requester: requester,
      roomid: roomid,
    });
  }
  /**
   * When the server emits a 'confirmChat' event, the client will emit a 'confirmChat' event to the
   * server.
   * @returns An Observable
   */
  getConfirmChat() {
    return new Observable((observer) => {
      this.socket.on('confirmChat', (data: any) => {
        observer.next(data);
      });
    });
  }
  /**
   * It emits a joinroom event to the server, which contains the roomid and the username of the user
   * who is joining the room.
   * @param roomid - the id of the room you want to join
   */
  joinRoom(roomid) {
    this.socket.emit('joinroom', {
      roomid: roomid,
      username: JSON.parse(sessionStorage.getItem('savedUser')).username,
    });
  }
  /**
   * The function emits a message to the server to leave a room
   * @param roomid - The id of the room you want to leave
   * @param username - The username of the user who is leaving the room
   */
  leaveRoom(roomid, username) {
    this.socket.emit('leaveroom', { roomid: roomid, username: username });
  }
  /**
   * The function returns an observable that listens for an event called 'imageMessage' and when it
   * receives it, it passes the data to the observer.
   * @returns An Observable
   */
  getImage() {
    return new Observable((observer) => {
      this.socket.on('imageMessage', (data: any) => {
        observer.next(data);
      });
    });
  }
  /**
   * When the socket receives a 'chatReq' event, emit the data to the observer.
   * @returns An observable that listens for the 'chatReq' event.
   */
  getChatReq() {
    return new Observable((observer) => {
      this.socket.on('chatReq', (data: any) => {
        observer.next(data);
      });
    });
  }
  /**
   * When the server emits a 'confirmChat' event, the client will emit a 'confirmChat' event to the
   * server, and the server will emit a 'confirmChat' event to the client.
   * @returns An observable that listens for the 'confirmChat' event.
   */
  getChatConfirm() {
    return new Observable((observer) => {
      this.socket.on('confirmChat', (data: any) => {
        observer.next(data);
      });
    });
  }

  /**
   * When the server sends a message with the event name "joinnotify", the client will receive the
   * message and pass it to the observer.next() function, which will then pass the message to the
   * subscribe() function in the component.
   * @returns An Observable
   */
  getJoinNotifications() {
    return new Observable((observer) => {
      this.socket.on('joinnotify', (joinMsg: string) => {
        observer.next(joinMsg);
      });
    });
  }
  /**
   * When the server sends a message with the event name 'leavenotify', the function will return an
   * observable that will emit the message sent by the server.
   * @returns An observable that will emit a string when the socket receives a "leavenotify" event.
   */
  getLeaveNotifications() {
    return new Observable((observer) => {
      this.socket.on('leavenotify', (leaveMsg: string) => {
        observer.next(leaveMsg);
      });
    });
  }

  /**
   * The function returns an observable that listens for a message event from the server and then emits
   * the data received from the server
   * @returns An observable that listens for a message from the server.
   */
  getMessage() {
    return new Observable((observer) => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  }
}
