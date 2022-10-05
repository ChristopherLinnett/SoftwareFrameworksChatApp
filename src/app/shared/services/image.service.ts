import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem'
import { LoadingController } from '@ionic/angular';
import { SavedImage } from '../classes/savedImage';
import { User } from '../classes/User';
import { HttpService } from './http.service';
import { SocketService } from './socket.service';

const IMAGE_DIR = 'image-storage'


@Injectable({
  providedIn: 'root'
})
export class ImageService {
user: User
  constructor(private loadingCtrl: LoadingController, private httpService: HttpService, private socketService: SocketService) {
    this.user = JSON.parse(sessionStorage.getItem("savedUser"))

   }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      width: 350,
      height: 350,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });
    if (image) {
      this.saveImage(image)
    }
  }
  async saveImage(photo: Photo){
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/temp.jpeg`,
      data: photo.base64String
    })
    console.log('saved', savedFile)
  }
  
  async startUpload( file: SavedImage, isChatMsg=false, roomid=false){
    const response = await fetch(file.data)
    const blob = await response.blob()
    const formData = new FormData()
    formData.append('file', blob, file.name);
    formData.append('username', this.user.username)
    if (isChatMsg){
      formData.append('chatMsg', 'true')
    } else {
      formData.append('chatMsg', 'false')
    }
    this.uploadData(formData,isChatMsg,roomid)
  }
  async uploadData(formData: FormData, isChatMsg, roomid){
    const loading = await this.loadingCtrl.create({
      message: 'Uploading...'
    });
    await loading.present()
    this.httpService.uploadImage(formData).subscribe((res: any)=>{
      if (isChatMsg){
        this.socketService.sendImage(res.filename,roomid )
      } else {
        var user = JSON.parse(sessionStorage.getItem('savedUser'))
        user.profileImg = res.filename
        sessionStorage.setItem('savedUser', JSON.stringify(user));

      }
      this.loadingCtrl.dismiss()
    })
  }
}
