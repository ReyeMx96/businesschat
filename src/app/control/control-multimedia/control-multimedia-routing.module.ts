import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlMultimediaPage } from './control-multimedia.page';

const routes: Routes = [
  {
    path: '',
    component: ControlMultimediaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlMultimediaPageRoutingModule {}
