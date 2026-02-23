import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationConfirmDataPageRoutingModule } from './location-confirm-data-routing.module';

import { LocationConfirmDataPage } from './location-confirm-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationConfirmDataPageRoutingModule
  ],
  declarations: [LocationConfirmDataPage]
})
export class LocationConfirmDataPageModule {}
