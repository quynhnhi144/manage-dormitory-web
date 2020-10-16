import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PowerBillsComponent } from './power-bills.component';
const routes: Routes = [
  {
    path: '',
    component: PowerBillsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PowerBillsRoutingModule {}
