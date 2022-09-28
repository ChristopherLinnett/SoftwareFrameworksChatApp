import { Component, OnInit } from '@angular/core';
import { User } from '../shared/classes/User'
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem'
import { LoadingController } from '@ionic/angular';
import { SavedImage } from '../shared/classes/savedImage';

const IMAGE_DIR = 'image-storage'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
editMode: boolean = false;
user: User;
images = [];
  constructor(private loadingCtrl: LoadingController) {
    this.user = JSON.parse(sessionStorage.getItem("savedUser"))
  }
  toggleEditMode(){
    this.editMode= !this.editMode
  }
  async ngOnInit() {
    this.loadFiles().then(()=>{console.log(this.images)})
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });
    console.log(image)
    if (image) {
      this.saveImage(image)
    }
  }
  async saveImage(photo: Photo){
    const filename = this.user.id + new Date().getTime()+'.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${filename}`,
      data: photo.base64String
    })
    console.log('saved: ', savedFile)
  }

  async loadFiles() {
    this.images = []

    const loading = await this.loadingCtrl.create({
      message: 'Loading data...'
    });
    await loading.present()
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
    }).then(_ => {
      loading.dismiss()
    })
  }
  async loadFileData(fileNames: FileInfo[]){
    for (let file of fileNames){
      const fileName = file.name
      const filePath = `${IMAGE_DIR}/${fileName}`
      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      })
      this.images.push({
        name: fileName,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
    })
    console.log(this.images)
    }
  }

  async startUpload( file: SavedImage){
    const response = await fetch(file.data)
    const blob = await response.blob()
    const formData = new FormData()
    formData.append('file', blob, file.name);
  }
  async uploadData(formData: FormData){
    const loading = await this.loadingCtrl.create({
      message: 'Uploading...'
    });
    await loading.present()

  }
  async deleteImage(file: SavedImage){
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path
    })
    this.loadFiles()
  }

}
