
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OpenStreetMapComponent } from './open-street-map/open-street-map.component';

import { Routes, RouterModule } from '@angular/router';
import { FileUploadModule } from 'ng2-file-upload';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletComponent } from './leaflet/leaflet.component';
import { HttpClientModule } from '@angular/common/http';



// определение маршрутов
const appRoutes: Routes = [
  { path: 'OSM', component: OpenStreetMapComponent },
  { path: '', component: LeafletComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    OpenStreetMapComponent,
    LeafletComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    LeafletModule,
    LeafletModule.forRoot(),
    FileUploadModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
