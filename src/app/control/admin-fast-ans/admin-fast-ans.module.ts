import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminFastAnsPageRoutingModule } from './admin-fast-ans-routing.module';

import { AdminFastAnsPage } from './admin-fast-ans.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminFastAnsPageRoutingModule
  ],
  declarations: [AdminFastAnsPage]
})
export class AdminFastAnsPageModule {}
