import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../shared/classes/User'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { LoadingController } from '@ionic/angular';
import { SavedImage } from '../shared/classes/savedImage';
import { HttpService } from '../shared/services/http.service';
import { ImageService } from '../shared/services/image.service';

const IMAGE_DIR = 'image-storage'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements AfterViewInit, OnDestroy {
editMode: boolean = false;
user: User;
image: { name: string; path: string; data: string; }
  constructor(private loadingCtrl: LoadingController, private httpService: HttpService, private imageService: ImageService) {
    this.user = JSON.parse(sessionStorage.getItem("savedUser"))
  }
  toggleEditMode(){
    this.editMode= !this.editMode
  }
  async ngAfterViewInit() {
    this.loadFiles()
  }
  avatarDirectory(){
    if (this.image != null){
      return this.image.data
    }
    if (this.user.profileImg){
      return this.httpService.URL+ 'images/' + this.user.profileImg
    } else { return './assets/icon/nouserimage.png'
  }

  }
  async selectImage() {
   await this.imageService.selectImage().then(()=>{
    setTimeout(()=>this.loadFiles(),100)
   })
  }

  async loadFiles() {

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR
    }).then(result => {
      this.loadFileData(result.files)
    }, async err => {
      console.log('error ', err)
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      })
    })
  }
  async loadFileData(files){
    if (files.length==1){
      var file = files[0]
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
  }
  async startUpload(file: SavedImage){
    this.imageService.startUpload(file)
    setTimeout(()=>this.user = JSON.parse(sessionStorage.getItem("savedUser")),100)
  }

  async deleteImage(){
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: IMAGE_DIR + '/temp.jpeg'
    })
    this.image = null
  }
  async ngOnDestroy(){
    if (this.image){
    await this.deleteImage()
  }
  }

}
