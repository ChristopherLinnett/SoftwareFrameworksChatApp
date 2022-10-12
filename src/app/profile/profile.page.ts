import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { User } from '../shared/classes/User';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular';
import { SavedImage } from '../shared/classes/savedImage';
import { HttpService } from '../shared/services/http.service';
import { ImageService } from '../shared/services/image.service';

const IMAGE_DIR = 'image-storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements AfterViewInit, OnDestroy {
  editMode: boolean = false;
  user: User;
  image: { name: string; path: string; data: string };
  constructor(
    private loadingCtrl: LoadingController,
    private httpService: HttpService,
    private imageService: ImageService
  ) {
    this.user = JSON.parse(sessionStorage.getItem('savedUser'));
  }
  /**
   * The function is called toggleEditMode and it toggles the editMode property of the component.
   */
  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  /**
   * When the view is ready, load the files.
   */
  async ngAfterViewInit() {
    this.loadFiles();
  }
  /**
   * If the user has an image, return the image. If the user has a profileImg, return the profileImg.
   * If neither, return the default image.
   * </code>
   * @returns The image data is being returned.
   */
  avatarDirectory() {
    if (this.image != null) {
      return this.image.data;
    }
    if (this.user.profileImg) {
      return this.httpService.URL + 'images/' + this.user.profileImg;
    } else {
      return './assets/icon/nouserimage.png';
    }
  }

  /**
   * The function calls the imageService.selectImage() function, which returns a promise. When the
   * promise is resolved, the function calls the loadFiles() function, which is a function that loads
   * the files from the database.
   *
   * The problem is that the loadFiles() function is not being called. I have tried using the
   * setTimeout() function, but it doesn't work.
   **/
  async selectImage() {
    await this.imageService.selectImage().then(() => {
      setTimeout(() => this.loadFiles(), 100);
    });
  }

  /**
   * It reads the directory, if it exists, and then loads the file data. If it doesn't exist, it
   * creates the directory
   */
  async loadFiles() {
    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR,
    }).then(
      (result) => {
        this.loadFileData(result.files);
      },
      async (err) => {
        console.log('error ', err);
        await Filesystem.mkdir({
          directory: Directory.Data,
          path: IMAGE_DIR,
        });
      }
    );
  }

  /**
   * "If the user selects a single file, read the file from the filesystem and store the file data in
   * the image property."
   * 
   * The first thing we do is check if the user has selected a single file. If they have, we store the
   * file in a variable called file
   * @param files - The array of files that were selected.
   */
  async loadFileData(files) {
    if (files.length == 1) {
      var file = files[0];
      const fileName = file.name;
      const filePath = `${IMAGE_DIR}/${fileName}`;
      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath,
      });
      this.image = {
        name: fileName,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      };
    }
  }

  /**
   * When the user clicks the upload button, the startUpload function is called, which calls the
   * startUpload function in the imageService, which uploads the image to the server, and then the user
   * is updated with the new image.
   * @param {SavedImage} file - SavedImage - this is the file that is being uploaded
   */
  async startUpload(file: SavedImage) {
    this.imageService.startUpload(file);
    setTimeout(
      () => (this.user = JSON.parse(sessionStorage.getItem('savedUser'))),
      100
    );
  }

  /**
   * This function deletes the image from the device's storage
   */
  async deleteImage() {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: IMAGE_DIR + '/temp.jpeg',
    });
    this.image = null;
  }
  /**
   * If the image exists, delete it.
   */
  async ngOnDestroy() {
    if (this.image) {
      await this.deleteImage();
    }
  }
}
