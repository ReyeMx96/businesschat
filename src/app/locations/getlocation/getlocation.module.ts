import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetlocationPageRoutingModule } from './getlocation-routing.module';

import { GetlocationPage } from './getlocation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetlocationPageRoutingModule
  ],
  declarations: [GetlocationPage]
})
export class GetlocationPageModule {}
