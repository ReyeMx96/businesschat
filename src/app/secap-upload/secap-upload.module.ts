import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecapUploadPageRoutingModule } from './secap-upload-routing.module';

import { SecapUploadPage } from './secap-upload.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SecapUploadPageRoutingModule
  ],
  declarations: [SecapUploadPage]
})
export class SecapUploadPageModule {}
