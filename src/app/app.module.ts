import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { OpenMapHeaderComponent } from './open-map-header/open-map-header.component';
import { OpenMapMainComponent } from './open-map-main/open-map-main.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OpenMapHeaderComponent,
    OpenMapMainComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
