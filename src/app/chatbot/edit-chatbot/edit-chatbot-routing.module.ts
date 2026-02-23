import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditChatbotPage } from './edit-chatbot.page';

const routes: Routes = [
  {
    path: '',
    component: EditChatbotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditChatbotPageRoutingModule {}
