import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaingListPage } from './campaing-list.page';

const routes: Routes = [
  {
    path: '',
    component: CampaingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaingListPageRoutingModule {}
