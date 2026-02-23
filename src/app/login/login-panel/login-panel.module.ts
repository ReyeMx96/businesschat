import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPanelPageRoutingModule } from './login-panel-routing.module';

import { LoginPanelPage } from './login-panel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPanelPageRoutingModule
  ],
  declarations: [LoginPanelPage]
})
export class LoginPanelPageModule {}
