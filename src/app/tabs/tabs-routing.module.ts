import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:[
      {
        path:'conversations',
        children:[
          {
            path:'',
            loadChildren:() => import('../../app/control/conversations/conversations.module').then(m => m.ConversationsPageModule)

          }

        ]

      },
         {
        path:'conversationsv2',
        children:[
          {
            path:'',
            loadChildren:() => import('../conversations-list/conversations-list.module').then(m => m.ConversationsListPageModule)

          }

        ]

      },
      {
        path:'control/:uid',
        children:[
          {
            path:'',
            loadChildren:() => import('../../app/control/control.module').then(m => m.ControlPageModule)

          }

        ]

      },
        {
        path:'gpt-control/:id',
        children:[
          {
            path:'',
            loadChildren:() => import('../../app/control/gpt-control/gpt-control.module').then(m => m.GptControlPageModule)

          }

        ]

      },
          {
        path:'punto-venta/:business',
        children:[
          {
            path:'',
            loadChildren:() => import('../punto-de-venta/punto-de-venta.module').then(m => m.PuntoDeVentaPageModule)

          }

        ]

      },
       {
        path:'panel/:id',
        children:[
          {
            path:'',
            loadChildren:() => import('../../app/control/panel/panel.module').then(m => m.PanelPageModule)

          }

        ]

      },
      {
        path:'clientes',
        children:[
          {
            path:'',
            loadChildren:() => import('../../app/control/client-tags/client-tags.module').then(m => m.ClientTagsPageModule)

          }

        ]

      },
      {
        path:'marketing',
        children:[
          {
            path:'',
            loadChildren:() => import('../../app/marketing/marketing.module').then(m => m.MarketingPageModule)

          }

        ]

      },
      {
        path:'stats/:id',
        children:[
          {
            path:'',
            loadChildren:() => import('../../app/tabs/stats/stats.module').then(m => m.StatsPageModule)

          }

        ]

      },
 
 
      {
        path:'',
        redirectTo: 'inicio',
        pathMatch: 'full'
        
      }
  ]
},
{
  path:'',
  redirectTo: 'inicio',
  pathMatch: 'full'
  


  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
