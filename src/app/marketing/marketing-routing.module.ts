import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketingPage } from './marketing.page';

const routes: Routes = [
  {
    path: '',
    component: MarketingPage
  },  {
    path: 'campaing-details',
    loadChildren: () => import('./campaing-details/campaing-details.module').then( m => m.CampaingDetailsPageModule)
  },
  {
    path: 'campaing-list',
    loadChildren: () => import('./campaing-list/campaing-list.module').then( m => m.CampaingListPageModule)
  },
  {
    path: 'select-publico',
    loadChildren: () => import('./select-publico/select-publico.module').then( m => m.SelectPublicoPageModule)
  },
  {
    path: 'adx-pro',
    loadChildren: () => import('./adx-pro/adx-pro.module').then( m => m.AdxProPageModule)
  },
  {
    path: 'adx-media',
    loadChildren: () => import('./adx-media/adx-media.module').then( m => m.AdxMediaPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingPageRoutingModule {}
