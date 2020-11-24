import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StudentsComponent } from './students.component';
import { AuthGuard } from '../../core/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: StudentsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {}
