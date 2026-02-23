import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/guard-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
    
  {
    path: 'login-panel',
    loadChildren: () => import('./login/login-panel/login-panel.module').then( m => m.LoginPanelPageModule),
    canActivate: [LoginGuard],

  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [LoginGuard],

  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'procesos',
    loadChildren: () => import('./procesos/procesos.module').then( m => m.ProcesosPageModule)
  },

  {
    path: 'marketing',
    loadChildren: () => import('./marketing/marketing.module').then( m => m.MarketingPageModule)
  },
   {
    path: 'select-publico',
    loadChildren: () => import('./../app/marketing/select-publico/select-publico.module').then( m => m.SelectPublicoPageModule)
  },
   {
    path: 'adx-pro',
    loadChildren: () => import('./../app/marketing/adx-pro/adx-pro.module').then( m => m.AdxProPageModule)
  },
   {
    path: 'adx-media',
    loadChildren: () => import('./../app/marketing/adx-media/adx-media.module').then( m => m.AdxMediaPageModule)
  },
  {
    path: 'check-paypal',
    loadChildren: () => import('./control/check-paypal/check-paypal.module').then( m => m.CheckPaypalPageModule)
  },
   {
    path: 'gpt-control/:id',
    loadChildren: () => import('./control/gpt-control/gpt-control.module').then( m => m.GptControlPageModule)
  },
    {
    path: 'mapa-lluvia',
    loadChildren: () => import('./control/mapa-lluvia/mapa-lluvia.module').then( m => m.MapaLluviaPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./control/client-tags/client-tags.module').then( m => m.ClientTagsPageModule)
  },
  {
    path: 'fast-answers',
    loadChildren: () => import('./control/fast-answers/fast-answers.module').then( m => m.FastAnswersPageModule)
  },
  {
    path: 'show-img',
    loadChildren: () => import('./control/show-img/show-img.module').then( m => m.ShowImgPageModule)
  },
  {
    path: 'conversations',
    loadChildren: () => import('./control/conversations/conversations.module').then( m => m.ConversationsPageModule)
  },
  {
    path: 'control',
    loadChildren: () => import('./control/control.module').then( m => m.ControlPageModule)
  },
  {
    path: 'p/:business',
    loadChildren: () => import('./chatbot/chatbot/chatbot.module').then( m => m.ChatbotPageModule)
  },
  {
    path: 'config-answer',
    loadChildren: () => import('./chatbot/config-answer/config-answer.module').then( m => m.ConfigAnswerPageModule)
  },
   {
    path: 'campaing-details/:id',
    loadChildren: () => import('./marketing/campaing-details/campaing-details.module').then( m => m.CampaingDetailsPageModule)
  },
  {
    path: 'edit-chatbot',
    loadChildren: () => import('./chatbot/edit-chatbot/edit-chatbot.module').then( m => m.EditChatbotPageModule)
  },
  {
    path: 'conversations-list',
    loadChildren: () => import('./conversations-list/conversations-list.module').then( m => m.ConversationsListPageModule)
  },
  {
    path: 'chat/:business',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
   {
    path: 'add-addons/:id',
    loadChildren: () => import('./../app/control/add-addons/add-addons.module').then( m => m.AddAddonsPageModule)
  },
  
  {
    path: 'politica',
    loadChildren: () => import('./politica/politica.module').then( m => m.PoliticaPageModule)
  },
   {
    path: 'inventario/:id',
    loadChildren: () => import('./control/catalogar/catalogar.module').then( m => m.CatalogarPageModule)
  },
  {
     path: 'menu/:id',
    loadChildren: () => import('./restaurantes/restaurant-products/restaurant-products.module').then( m => m.RestaurantProductsPageModule)
  },
  {
    path: 'carrito/:neg/:devMode/:session',
    loadChildren: () => import('./restaurantes/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'terminar-pedido/:neg/:devMode/:session',
    loadChildren: () => import('./restaurantes/terminar-pedido/terminar-pedido.module').then( m => m.TerminarPedidoPageModule)
  },
  {
    path: 'status-pedido',
    loadChildren: () => import('./restaurantes/status-pedido/status-pedido.module').then( m => m.StatusPedidoPageModule)
  },
    {
    path: 'stats/:id',
    loadChildren: () => import('../app/tabs/stats/stats.module').then( m => m.StatsPageModule)
  },
  {
    path: 'history-pedidos',
    loadChildren: () => import('./restaurantes/history-pedidos/history-pedidos.module').then( m => m.HistoryPedidosPageModule)
  },
  {
    path: 'panel/:id',
    loadChildren: () => import('./control/panel/panel.module').then( m => m.PanelPageModule)
  },
  {
    path: 'location-type',
    loadChildren: () => import('./locations/location-type/location-type.module').then( m => m.LocationTypePageModule)
  },
  {
    path: 'search-location',
    loadChildren: () => import('./locations/search-location/search-location.module').then( m => m.SearchLocationPageModule)
  },
  {
    path: 'location-confirm-data',
    loadChildren: () => import('./locations/location-confirm-data/location-confirm-data.module').then( m => m.LocationConfirmDataPageModule)
  },
 
  {
    path: 'comanda/:array',
    loadChildren: () => import('./comanda/comanda.module').then( m => m.ComandaPageModule)
  },
  {
    path: 'waiting-panel',
    loadChildren: () => import('./waiting-panel/waiting-panel.module').then( m => m.WaitingPanelPageModule)
  },
  {
    path: 'secap-demo',
    loadChildren: () => import('./secap-demo/secap-demo.module').then( m => m.SecapDemoPageModule)
  },
  {
    path: 'secap-upload',
    loadChildren: () => import('./secap-upload/secap-upload.module').then( m => m.SecapUploadPageModule)
  },
  {
    path: 'buy-finish/:id',
    loadChildren: () => import('./restaurantes/buy-finish/buy-finish.module').then( m => m.BuyFinishPageModule)
  },
  {
    path: 'choose-payment-methods',
    loadChildren: () => import('./restaurantes/choose-payment-methods/choose-payment-methods.module').then( m => m.ChoosePaymentMethodsPageModule)
  },
  {
    path: 'add-card',
    loadChildren: () => import('./restaurantes/add-card/add-card.module').then( m => m.AddCardPageModule)
  },
   {
    path: 'gestion-accesos',
    loadChildren: () => import('./control/gestion-accesos/gestion-accesos.module').then( m => m.GestionAccesosPageModule)
  },
  {
    path: 'control-multimedia',
    loadChildren: () => import('./control/control-multimedia/control-multimedia.module').then( m => m.ControlMultimediaPageModule)
  },
  {
    path: 'getlocation/:botNumber/:clientNumber/:restaurante/:type/:session',
    loadChildren: () => import('./locations/getlocation/getlocation.module').then( m => m.GetlocationPageModule)
  },
  {
    path: 'punto-venta/:business',
    loadChildren: () => import('./punto-de-venta/punto-de-venta.module').then( m => m.PuntoDeVentaPageModule)
  },
  {
    path: 'workspace',
    loadChildren: () => import('./workspace/workspace.module').then( m => m.WorkspacePageModule)
  },
  {
    path: 'codigos-postales',
    loadChildren: () => import('./control/codigos-postales/codigos-postales.module').then( m => m.CodigosPostalesPageModule)
  },
    {
    path: 'admin-fast-ans',
    loadChildren: () => import('./control/admin-fast-ans/admin-fast-ans.module').then( m => m.AdminFastAnsPageModule)
  },
   {
    path: 'settings/:id',
    loadChildren: () => import('./control/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'control-smart-home',
    loadChildren: () => import('./control-smart-home/control-smart-home.module').then( m => m.ControlSmartHomePageModule)
  },
  {
    path: 'facturacion-test',
    loadChildren: () => import('./control/facturacion-test/facturacion-test.module').then( m => m.FacturacionTestPageModule)
  },
  {
    path: 'pedidos-history',
    loadChildren: () => import('./restaurantes/pedidos-history/pedidos-history.module').then( m => m.PedidosHistoryPageModule)
  },
  {
    path: 'pedidos-history/:id',
    loadChildren: () => import('./restaurantes/pedidos-history/pedidos-history.module').then( m => m.PedidosHistoryPageModule)
  },
  {
    path: 'solicitar-repa',
    loadChildren: () => import('./restaurantes/solicitar-repa/solicitar-repa.module').then( m => m.SolicitarRepaPageModule)
  },

  {
    path: 'inicio',
    loadChildren: () => import('./landing-page/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'como-funciona',
    loadChildren: () => import('./landing-page/como-funciona/como-funciona.module').then( m => m.ComoFuncionaPageModule)
  },
  {
    path: 'precios',
    loadChildren: () => import('./landing-page/precios/precios.module').then( m => m.PreciosPageModule)
  },
  {
    path: 'mision-y-vision',
    loadChildren: () => import('./landing-page/mision-y-vision/mision-y-vision.module').then( m => m.MisionYVisionPageModule)
  },
  {
    path: 'contacto',
    loadChildren: () => import('./landing-page/contacto/contacto.module').then( m => m.ContactoPageModule)
  },

];

@NgModule({
  imports: [
    //RouterModule.forRoot(routes)
    // tRADICIONAL 

    // useHash: true para que funcione en eLECTRON Pages, eliminarlo si se despliega en un servidor con soporte para Angular  
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
