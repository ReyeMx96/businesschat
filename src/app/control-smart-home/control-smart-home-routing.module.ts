import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlSmartHomePage } from './control-smart-home.page';

const routes: Routes = [
  {
    path: '',
    component: ControlSmartHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlSmartHomePageRoutingModule {}
