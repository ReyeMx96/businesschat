import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionAccesosPageRoutingModule } from './gestion-accesos-routing.module';

import { GestionAccesosPage } from './gestion-accesos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionAccesosPageRoutingModule
  ],
  declarations: [GestionAccesosPage]
})
export class GestionAccesosPageModule {}
