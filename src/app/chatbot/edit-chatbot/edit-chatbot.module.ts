import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditChatbotPageRoutingModule } from './edit-chatbot-routing.module';

import { EditChatbotPage } from './edit-chatbot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditChatbotPageRoutingModule
  ],
  declarations: [EditChatbotPage]
})
export class EditChatbotPageModule {}
