import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConversationsListPageRoutingModule } from './conversations-list-routing.module';

import { ConversationsListPage } from './conversations-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversationsListPageRoutingModule
  ],
  declarations: [ConversationsListPage]
})
export class ConversationsListPageModule {}
