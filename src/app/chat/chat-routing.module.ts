import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPage } from './chat.page';
import { VideocallmodalComponent } from './videocallmodal/videocallmodal.component';

const routes: Routes = [
  {
    path: '',
    component: ChatPage,
  },
  {
    path: 'video-chat/:recipient',
    component: VideocallmodalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatPageRoutingModule {}
