import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GptControlPageRoutingModule } from './gpt-control-routing.module';

import { GptControlPage } from './gpt-control.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GptControlPageRoutingModule
  ],
  declarations: [GptControlPage]
})
export class GptControlPageModule {}
