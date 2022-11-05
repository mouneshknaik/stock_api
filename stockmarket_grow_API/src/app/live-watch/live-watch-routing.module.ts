import { LiveWatchComponent } from './live-watch.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path:'',
  component:LiveWatchComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveWatchRoutingModule { }
