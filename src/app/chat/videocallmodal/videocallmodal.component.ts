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
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private authService: AuthService,
    private peerService: PeerService,
    private modalController: ModalController
  ) {
    this.ownID = this.authService.getSavedUser().id;
  }

  /**
   * We subscribe to the route parameters and assign the recipient to the recipient variable. We then
   * call the streamCamera function and pass in the recipient variable
   */
  ngOnInit() {
    this.routeSnap = this.activatedRoute.params.subscribe((params) => {
      this.recipient = params.recipient;
      this.streamCamera(this.recipient);
    });
    if (
      this.platform.is('android') ||
      this.platform.is('mobileweb') ||
      this.platform.is('ios')
    ) {
      this.isApp = true;
    } else {
      this.isApp = false;
    }
  }
  /**
   * The function is called when the component is destroyed
   */
  ngOnDestroy() {
    this.endCall();
  }
  /**
   * It gets the local stream, adds it to the video element, reconnects the peer if it's disconnected,
   * and then calls the answering and calling functions
   * @param recipient - the recipient's peerId
   */
  async streamCamera(recipient) {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    await this.addMyVideo();
    if (this.peerService.myPeer.disconnected) {
      await this.peerService.myPeer.reconnect();
    }
    this.answering(this.localStream);
    this.calling(recipient, this.peerService.myPeerId, this.localStream);
    this.isCallStarted = true;
  }

  /**
   * It gets the screen stream, adds the video to the local stream, reconnects the peer if it's
   * disconnected, answers the call, and calls the recipient
   * @param recipient - the recipient of the call
   */
  async streamScreen(recipient = this.recipient) {
    let stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
    await this.addMyVideo();
    if (this.peerService.myPeer.disconnected) {
      await this.peerService.myPeer.reconnect();
    }
    this.answering(this.localStream);
    this.calling(recipient, this.peerService.myPeerId, stream);
    this.isCallStarted = true;
  }

  /**
   * The function takes in a peerid, userId, and stream. It then calls the peerid with the stream and
   * metadata. If the call is successful, it adds the other user's video stream to the DOM. If the call
   * is unsuccessful, it ends the call
   * @param peerid - the peer id of the user you want to call
   * @param userId - the id of the user you are calling
   * @param stream - the stream of the user who is calling
   */
  calling(peerid, userId, stream) {
    const call = this.peerService.myPeer.call(peerid, stream, {
      metadata: { peerid: userId },
    });
    console.log(call);
    call.on('stream', (otherUserVideoStream: MediaStream) => {
      console.log('receiving other user stream after connection');
      this.addOtherUserVideo(peerid, otherUserVideoStream);
    });
    call.on('close', () => {
      this.endCall();
    });
  }

  /**
   * When a call is received, answer it with the stream, add the other user's video to the page, and end
   * the call when it's closed or an error occurs
   * @param stream - the stream that you want to send to the other user
   */
  answering(stream) {
    this.peerService.myPeer.on('call', (call) => {
      console.log('receiving call...', call);
      call.answer(stream);

      call.on('stream', (otherUserVideoStream: MediaStream) => {
        console.log('receiving other stream', otherUserVideoStream);
        this.addOtherUserVideo(call.metadata.peerId, otherUserVideoStream);
      });
      call.on('close', () => {
        this.endCall();
      });
      call.on('error', (err) => {
        console.error(err);
      });
    });
  }

  /**
   * We're casting the event.target as a HTMLVideoElement and then calling the play() method on it
   * @param {Event} event - Event - The event object that is passed to the function.
   */
  onLoadedMetadata(event: Event) {
    (event.target as HTMLVideoElement).play();
  }

  /**
   * We're creating a new object called myVideo and assigning it to the localStream variable
   */
  addMyVideo() {
    {
      this.myVideo = {
        muted: true,
        srcObject: this.localStream,
        userId: this.peerService.myPeerId,
      };
    }
  }

  /**
   * This function takes in a userId and a MediaStream object and sets the otherVideo property to an
   * object with the userId and the MediaStream object
   * @param {string} userId - The userId of the user who's video you want to add.
   * @param {MediaStream} stream - MediaStream - This is the stream that you get from the user's
   * webcam.
   */
  addOtherUserVideo(userId: string, stream: MediaStream) {
    this.otherVideo = {
      muted: false,
      srcObject: stream,
      userId: userId,
    };
  }
  /**
   * We disconnect from the peer, set the video streams to null, set the call started flag to false,
   * stop the local stream, and navigate back to the home page
   */
  async endCall() {
    await this.peerService.myPeer.disconnect();
    this.myVideo = null;
    this.otherVideo = null;
    this.isCallStarted = false;
    this.localStream.getTracks().forEach((track) => track.stop());
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
  }
}
