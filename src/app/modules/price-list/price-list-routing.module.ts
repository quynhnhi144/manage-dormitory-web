import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../core/guards/auth.guard';
import { PriceListComponent } from './price-list.component';
const routes: Routes = [
  {
    path: '',
    component: PriceListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PriceListRoutingModule {}
