import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { PeerService } from 'src/app/shared/services/peer.service';

@Component({
  selector: 'app-videocallmodal',
  templateUrl: './videocallmodal.component.html',
  styleUrls: ['./videocallmodal.component.scss'],
})
export class VideocallmodalComponent implements OnInit, OnDestroy {
  ownID: string;
  otherVideo;
  myVideo;
  localStream;
  externalStream;
  isCallStarted: boolean;
  recipient;
  routeSnap;
  isApp;
  constructor(private router: Router, private activatedRoute: ActivatedRoute,private platform: Platform, private authService: AuthService, private peerService: PeerService, private modalController: ModalController) {
    this.ownID = this.authService.getSavedUser().id
   }

  ngOnInit() {
this.routeSnap = this.activatedRoute.params.subscribe((params)=>{
  this.recipient = params.recipient
})
if(this.platform.is('android') || this.platform.is('mobileweb') || this.platform.is('ios')){
  this.isApp = true;
} else {
  this.isApp = false;
}  }
  
  ngOnDestroy() {
    this.endCall()
  }
async streamCamera(recipient){
  this.localStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  });
  await this.addMyVideo();
  if (this.peerService.myPeer.disconnected){
    await this.peerService.myPeer.reconnect();
  }
  this.answering(this.localStream);
  this.calling(recipient,this.peerService.myPeerId, this.localStream)
  this.isCallStarted = true;
}

async streamScreen(recipient= this.recipient){
  let stream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true
  });
  await this.addMyVideo();
  if (this.peerService.myPeer.disconnected){
    await this.peerService.myPeer.reconnect();
  }
  this.answering(this.localStream);
  this.calling(recipient, this.peerService.myPeerId, stream);
  this.isCallStarted = true;
}

calling(peerid, userId, stream){
  const call = this.peerService.myPeer.call(peerid,stream, {
    metadata: {peerid: userId}
  })
  console.log(call)
  call.on('stream', (otherUserVideoStream: MediaStream)=> {
    console.log('receiving other user stream after connection');
    this.addOtherUserVideo(peerid, otherUserVideoStream)
  })
  call.on('close', () => {
    this.endCall()
  })
}

answering(stream){
  this.peerService.myPeer.on('call', (call)=>{
    console.log('receiving call...', call);
    call.answer(stream);

    call.on('stream', (otherUserVideoStream: MediaStream)=>{
      console.log('receiving other stream', otherUserVideoStream);
      this.addOtherUserVideo(call.metadata.peerId, otherUserVideoStream);
    })
    call.on('close', ()=>{
      this.endCall()
    })
    call.on('error', (err)=>{
      console.error(err)
    })
  })
}

  onLoadedMetadata(event: Event){
    (event.target as HTMLVideoElement).play();
  }

  addMyVideo(){{
    this.myVideo = {
    muted: true,
    srcObject: this.localStream,
    userId: this.peerService.myPeerId
  }
  }
  }

  addOtherUserVideo(userId: string, stream: MediaStream){
    this.otherVideo = {
      muted: false,
      srcObject: stream,
      userId: userId
    }
    
  }
  async endCall(){
    await this.peerService.myPeer.disconnect()
    this.myVideo = null
    this.otherVideo = null
    this.isCallStarted = false;
    this.localStream.getTracks().forEach(track => track.stop())
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
  }
}
