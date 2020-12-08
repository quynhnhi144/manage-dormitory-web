import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShareModule } from '../../shared/share.module';
import { AuthGuard } from '../../core/guards/auth.guard';
import { EMailComponent } from './e-mail.component';
const routes: Routes = [
  {
    path: '',
    component: EMailComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ShareModule],
  exports: [RouterModule],
})
export class EMailRoutingModule {}
