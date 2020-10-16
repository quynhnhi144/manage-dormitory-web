import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { ShareModule } from '../../shared/share.module';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ShareModule],
  exports: [RouterModule],
})
export class DashBoardRoutingModule {}
