import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingPanelPageRoutingModule } from './waiting-panel-routing.module';

import { WaitingPanelPage } from './waiting-panel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingPanelPageRoutingModule
  ],
  declarations: [WaitingPanelPage]
})
export class WaitingPanelPageModule {}
