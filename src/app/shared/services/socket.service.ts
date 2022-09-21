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
  sendMessage(messageText: string) {
    this.socket.emit('message', {message: messageText, user: JSON.parse(sessionStorage.getItem('savedUser')).username})
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