import { Injectable } from '@angular/core';
import { Camera, CameraDirection, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
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

  /**
   * This function will open the camera, take a picture, and then save the image to the device's local
   * storage.
   */
  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      width: 640,
      height: 640,
      allowEditing: false,
      direction: CameraDirection.Front,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });
    if (image) {
      this.saveImage(image)
    }
  }
  /**
   * It takes a photo object, writes the base64String to a file, and returns the file object
   * @param {Photo} photo - Photo - this is the photo object that is returned from the camera plugin
   */
  async saveImage(photo: Photo){
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/temp.jpeg`,
      data: photo.base64String
    })
    console.log('saved', savedFile)
  }
  
  /**
   * This function takes a file, and uploads it to the server.
   * @param {SavedImage} file - SavedImage - this is the file that was saved to the device
   * @param [isChatMsg=false] - boolean, if true, the image is a chat message, if false, it's a profile
   * image
   * @param [roomid=false] - the id of the room the image is being uploaded to
   */
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
  /**
   * It takes a formData object, a boolean, and a roomid, and uploads the formData to the server, and
   * if the boolean is true, it sends the filename to the server via socket.io.
   * @param {FormData} formData - FormData, isChatMsg, roomid
   * @param isChatMsg - boolean
   * @param roomid - the id of the room the user is in
   */
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
