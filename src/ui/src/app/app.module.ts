import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import {AccordionModule} from 'primeng/accordion';
import {MenuItem} from 'primeng/api';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TabMenuModule} from 'primeng/tabmenu';
import { AlgorithmComponent } from './algorithm/algorithm.component';
import { HomeComponent } from './home/home.component';
import {CardModule} from 'primeng/card';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MultiplayerComponent,
    AlgorithmComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccordionModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    TabMenuModule,
    CardModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
