import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationTypePageRoutingModule } from './location-type-routing.module';

import { LocationTypePage } from './location-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationTypePageRoutingModule
  ],
  declarations: [LocationTypePage]
})
export class LocationTypePageModule {}
