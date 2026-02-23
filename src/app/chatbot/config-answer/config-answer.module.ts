import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigAnswerPageRoutingModule } from './config-answer-routing.module';

import { ConfigAnswerPage } from './config-answer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigAnswerPageRoutingModule
  ],
  declarations: [ConfigAnswerPage]
})
export class ConfigAnswerPageModule {}
