import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat'; // AngularFireModule
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment.prod';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverOptionsChatComponent } from './popovers/popover-options-chat/popover-options-chat.component';
import { PopoverSettingsChatComponent } from './popovers/popover-settings-chat/popover-settings-chat.component';
import { DirectivesModule } from './directives/directives.module';
import { ModalCartComponent } from './modals/modal-cart/modal-cart.component';
import { ModalAddComponent } from './modals/modal-add/modal-add.component';
import { ModalChooseComponent } from './modals/modal-choose/modal-choose.component';
import { ModalFinalizarComponent } from './modals/modal-finalizar/modal-finalizar.component';
import { ModalProfileComponent } from './modals/modal-profile/modal-profile.component';
import { ModalDateComponent } from './modals/modal-date/modal-date.component';
import { ModalFiltersComponent } from './modals/modal-filters/modal-filters.component';
import { ModalTextsComponent } from './modals/modal-texts/modal-texts.component';
import { ModalUsersComponent } from './modals/modal-users/modal-users.component';
import { ShowFullImgComponent } from './modals/show-full-img/show-full-img.component';
import { ModalTagsComponent } from './modals/modal-tags/modal-tags.component';
import { ModalToppingsComponent } from './modals/modal-toppings/modal-toppings.component';
import { ModalDireccionesComponent } from './modals/modal-direcciones/modal-direcciones.component';
import { ModalimgComponent } from './modals/modalimg/modalimg.component';
import { ModalCreateProductComponent } from './modals/modal-create-product/modal-create-product.component';
import { EditProductComponent } from './popovers/edit-product/edit-product.component';
import { ActionProductsComponent } from './popovers/action-products/action-products.component';
import { ModalComplementosComponent } from './modals/modal-complementos/modal-complementos.component';
import { ModalCartNewComponent } from './modals/modal-cart-new/modal-cart-new.component';
import { ModalCreateOrderComponent } from './modals/modal-create-order/modal-create-order.component';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { ModalBuyComponent } from './modals/modal-buy/modal-buy.component';
import { ModalVerifyWppComponent } from './modals/modal-verify-wpp/modal-verify-wpp.component';
import { ModalCheckLocationComponent } from './modals/modal-check-location/modal-check-location.component';
import { ModalCreateComponent } from './punto-de-venta/modal-create/modal-create.component';
import { ModalEditActionComponent } from './modals/modal-edit-action/modal-edit-action.component';
import { ImageViewerComponent } from './modals/image-viewer/image-viewer.component';
import { FlowComponent } from './control/flow/flow.component';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ResendMessageComponent } from './modals/resend-message/resend-message.component';
import { ActionMessagesComponent } from './popovers/action-messages/action-messages.component';
import { CreateCampaignModalComponent } from './marketing/create-campaign-modal/create-campaign-modal.component';
import { ModalRestaurantesSelectComponent } from './modals/modal-restaurantes-select/modal-restaurantes-select.component';
import { ModalTagsRestauranteComponent } from './control/settings/modal-tags-restaurante/modal-tags-restaurante.component';
import { ModalHashtagsComponent } from './control/settings/modal-hashtags/modal-hashtags.component';

@NgModule({
  declarations: [AppComponent, CreateCampaignModalComponent,ActionMessagesComponent,FlowComponent,ResendMessageComponent, ImageViewerComponent ,ModalEditActionComponent,ModalCreateComponent,ModalCheckLocationComponent,ModalVerifyWppComponent,ModalTagsComponent, ModalBuyComponent ,PopoverOptionsChatComponent,PopoverSettingsChatComponent,ModalComplementosComponent,
    ModalToppingsComponent,  ModalDireccionesComponent,ModalimgComponent,ModalCreateProductComponent, EditProductComponent, ActionProductsComponent,
    ModalCartComponent,ModalTagsRestauranteComponent, ModalHashtagsComponent ,ModalAddComponent, ModalChooseComponent, ModalFinalizarComponent,ModalFiltersComponent,ModalCartNewComponent, ModalCreateOrderComponent,
     ModalDateComponent,ModalProfileComponent,ModalRestaurantesSelectComponent, ModalTextsComponent, ModalUsersComponent, ShowFullImgComponent],
  imports: 
  [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
      DirectivesModule,
      
    HttpClientModule,
     AngularFireFunctionsModule,  
    AngularFireModule.initializeApp(environment.firebaseConfig), // Inicializar Firebase
  AngularFireAuthModule,
    AngularFirestoreModule,
      ServiceWorkerModule.register('combined-js.js', {
  enabled: true,
  // Register the ServiceWorker as soon as the app is stable
  // or after 20 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:5000'
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
