import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlMultimediaPageRoutingModule } from './control-multimedia-routing.module';

import { ControlMultimediaPage } from './control-multimedia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlMultimediaPageRoutingModule
  ],
  declarations: [ControlMultimediaPage]
})
export class ControlMultimediaPageModule {}
