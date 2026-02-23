import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientTagsPageRoutingModule } from './client-tags-routing.module';

import { ClientTagsPage } from './client-tags.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientTagsPageRoutingModule
  ],
  declarations: [ClientTagsPage]
})
export class ClientTagsPageModule {}
