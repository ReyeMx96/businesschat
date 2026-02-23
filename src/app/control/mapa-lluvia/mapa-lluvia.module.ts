import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaLluviaPageRoutingModule } from './mapa-lluvia-routing.module';

import { MapaLluviaPage } from './mapa-lluvia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaLluviaPageRoutingModule
  ],
  declarations: [MapaLluviaPage]
})
export class MapaLluviaPageModule {}
