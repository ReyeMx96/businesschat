import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdxMediaPageRoutingModule } from './adx-media-routing.module';

import { AdxMediaPage } from './adx-media.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdxMediaPageRoutingModule
  ],
  declarations: [AdxMediaPage]
})
export class AdxMediaPageModule {}
