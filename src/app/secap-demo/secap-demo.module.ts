import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecapDemoPageRoutingModule } from './secap-demo-routing.module';

import { SecapDemoPage } from './secap-demo.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SecapDemoPageRoutingModule
  ],
  declarations: [SecapDemoPage]
})
export class SecapDemoPageModule {}
