import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatPage } from './chat.page';

import { ChatPageRoutingModule } from './chat-routing.module';
import { VideocallmodalComponent } from './videocallmodal/videocallmodal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ChatPageRoutingModule
  ],
  declarations: [ChatPage, VideocallmodalComponent]
})
export class ChatPageModule {}
