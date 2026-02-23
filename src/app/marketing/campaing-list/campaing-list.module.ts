import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaingListPageRoutingModule } from './campaing-list-routing.module';

import { CampaingListPage } from './campaing-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampaingListPageRoutingModule
  ],
  declarations: [CampaingListPage]
})
export class CampaingListPageModule {}
