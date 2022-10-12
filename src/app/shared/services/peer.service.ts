import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import Peer from 'peerjs';
import { HttpService } from './http.service';
@Injectable({
  providedIn: 'root'
})
export class PeerService {
myPeerId: string;
myPeer: Peer;
  constructor(private authService: AuthService, private httpService: HttpService) {
    this.myPeerId = this.authService.getSavedUser().id
    this.myPeer = new Peer(this.myPeerId,{
      host: httpService.IP,
      port: 3000,
      path: "/"
    })
  }
}
