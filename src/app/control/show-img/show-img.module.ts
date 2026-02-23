import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowImgPageRoutingModule } from './show-img-routing.module';

import { ShowImgPage } from './show-img.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowImgPageRoutingModule
  ],
  declarations: [ShowImgPage]
})
export class ShowImgPageModule {}
