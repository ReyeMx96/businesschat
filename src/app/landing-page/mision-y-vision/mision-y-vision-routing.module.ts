import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisionYVisionPage } from './mision-y-vision.page';

const routes: Routes = [
  {
    path: '',
    component: MisionYVisionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisionYVisionPageRoutingModule {}
