import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComoFuncionaPageRoutingModule } from './como-funciona-routing.module';

import { ComoFuncionaPage } from './como-funciona.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComoFuncionaPageRoutingModule
  ],
  declarations: [ComoFuncionaPage]
})
export class ComoFuncionaPageModule {}
