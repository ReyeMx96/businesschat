import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPanelPage } from './login-panel.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPanelPageRoutingModule {}
