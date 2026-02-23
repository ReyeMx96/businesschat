import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisionYVisionPageRoutingModule } from './mision-y-vision-routing.module';

import { MisionYVisionPage } from './mision-y-vision.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisionYVisionPageRoutingModule
  ],
  declarations: [MisionYVisionPage]
})
export class MisionYVisionPageModule {}
