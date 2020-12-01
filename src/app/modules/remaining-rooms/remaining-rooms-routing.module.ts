import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RemainingRoomsComponent } from './remaining-rooms.component';
const routes: Routes = [
  {
    path: '',
    component: RemainingRoomsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemainingRoomsRoutingModule {}
