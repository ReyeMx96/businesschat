import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatalogarPageRoutingModule } from './catalogar-routing.module';

import { CatalogarPage } from './catalogar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatalogarPageRoutingModule
  ],
  declarations: [CatalogarPage]
})
export class CatalogarPageModule {}
