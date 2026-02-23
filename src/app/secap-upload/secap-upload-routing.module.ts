import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecapUploadPage } from './secap-upload.page';

const routes: Routes = [
  {
    path: '',
    component: SecapUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecapUploadPageRoutingModule {}
