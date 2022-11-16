import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
},{
  path: 'page',
  loadChildren: () => import('./page/page.module').then(m => m.PageModule)
},{
  path: 'all-stock',
  loadChildren: () => import('./all-stock/all-stock.module').then(m => m.AllStockModule)
},{
  path: 'live-watch',
  loadChildren: () => import('./live-watch/live-watch.module').then(m => m.LiveWatchModule)
},{
  path: 'live-chart',
  loadChildren: () => import('./live-chart/live-chart.module').then(m => m.LiveChartModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
