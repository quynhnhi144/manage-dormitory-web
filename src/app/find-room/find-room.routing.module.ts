import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FindRoomComponent } from './find-room.component';
const routes: Routes = [
  {
    path: '',
    component: FindRoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindRoomRoutingModule {}
