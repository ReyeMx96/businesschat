import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaLluviaPage } from './mapa-lluvia.page';

const routes: Routes = [
  {
    path: '',
    component: MapaLluviaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaLluviaPageRoutingModule {}
