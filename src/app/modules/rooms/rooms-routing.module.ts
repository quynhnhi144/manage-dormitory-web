import { Routes, RouterModule } from '@angular/router';
import { RoomsComponent } from './rooms.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../core/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: RoomsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomsRoutingModule {}
