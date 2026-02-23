import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlSmartHomePageRoutingModule } from './control-smart-home-routing.module';

import { ControlSmartHomePage } from './control-smart-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlSmartHomePageRoutingModule
  ],
  declarations: [ControlSmartHomePage]
})
export class ControlSmartHomePageModule {}
