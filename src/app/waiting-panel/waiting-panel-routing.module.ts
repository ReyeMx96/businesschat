import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingPanelPage } from './waiting-panel.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingPanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingPanelPageRoutingModule {}
