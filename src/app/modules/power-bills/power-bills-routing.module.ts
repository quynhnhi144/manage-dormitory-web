import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PowerBillsComponent } from './power-bills.component';
import { AuthGuard } from '../../core/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: PowerBillsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PowerBillsRoutingModule {}
