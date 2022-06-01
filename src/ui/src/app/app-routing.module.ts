import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MultiplayerComponent} from '../app/multiplayer/multiplayer.component'

const routes: Routes = [
{ path: 'multiplayer', component: MultiplayerComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
