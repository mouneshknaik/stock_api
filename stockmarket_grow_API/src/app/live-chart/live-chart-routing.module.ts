import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveChartComponent } from './live-chart.component';

const routes: Routes = [{
  path:'',
  component:LiveChartComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveChartRoutingModule { }
