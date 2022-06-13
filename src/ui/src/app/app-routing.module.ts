import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultiplayerComponent } from '../app/multiplayer/multiplayer.component'
import { AlgorithmComponent } from './algorithm/algorithm.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'multiplayer', component: MultiplayerComponent },
  { path: 'algorithm', component: AlgorithmComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
