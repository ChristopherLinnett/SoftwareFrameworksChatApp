import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectionPageRoutingModule } from './selection-routing.module';

import { SelectionPage } from './selection.page';
import { AssistantModalComponent } from './assistant-modal/assistant-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectionPageRoutingModule
  ],
  declarations: [SelectionPage, AssistantModalComponent]
})
export class SelectionPageModule {}
