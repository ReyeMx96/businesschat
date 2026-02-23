import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowImgPage } from './show-img.page';

const routes: Routes = [
  {
    path: '',
    component: ShowImgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowImgPageRoutingModule {}
