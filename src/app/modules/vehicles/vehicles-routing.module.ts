import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { VehiclesComponent } from './vehicles.component';
import { AuthGuard } from '../../core/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: VehiclesComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiclesRoutingModule {}
