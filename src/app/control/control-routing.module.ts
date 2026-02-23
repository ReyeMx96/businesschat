import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlPage } from './control.page';

const routes: Routes = [
  {
    path: '',
    component: ControlPage
  },  {
    path: 'panel',
    loadChildren: () => import('./panel/panel.module').then( m => m.PanelPageModule)
  },
  {
    path: 'catalogar',
    loadChildren: () => import('./catalogar/catalogar.module').then( m => m.CatalogarPageModule)
  },
  {
    path: 'add-addons',
    loadChildren: () => import('./add-addons/add-addons.module').then( m => m.AddAddonsPageModule)
  },
  {
    path: 'mapa-lluvia',
    loadChildren: () => import('./mapa-lluvia/mapa-lluvia.module').then( m => m.MapaLluviaPageModule)
  },
  {
    path: 'gestion-accesos',
    loadChildren: () => import('./gestion-accesos/gestion-accesos.module').then( m => m.GestionAccesosPageModule)
  },
  {
    path: 'control-multimedia',
    loadChildren: () => import('./control-multimedia/control-multimedia.module').then( m => m.ControlMultimediaPageModule)
  },
  {
    path: 'gpt-control',
    loadChildren: () => import('./gpt-control/gpt-control.module').then( m => m.GptControlPageModule)
  },
  {
    path: 'codigos-postales',
    loadChildren: () => import('./codigos-postales/codigos-postales.module').then( m => m.CodigosPostalesPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'admin-fast-ans',
    loadChildren: () => import('./admin-fast-ans/admin-fast-ans.module').then( m => m.AdminFastAnsPageModule)
  },
  {
    path: 'facturacion-test',
    loadChildren: () => import('./facturacion-test/facturacion-test.module').then( m => m.FacturacionTestPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlPageRoutingModule {}
