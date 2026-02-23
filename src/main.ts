import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment.prod';
import { enableProdMode } from '@angular/core';
import 'hammerjs';
if (environment.production){
  enableProdMode()
}

// ⭐ Luego cargar Angular
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
