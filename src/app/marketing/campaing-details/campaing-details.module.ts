import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaingDetailsPageRoutingModule } from './campaing-details-routing.module';

import { CampaingDetailsPage } from './campaing-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampaingDetailsPageRoutingModule
  ],
  declarations: [CampaingDetailsPage]
})
export class CampaingDetailsPageModule {}
