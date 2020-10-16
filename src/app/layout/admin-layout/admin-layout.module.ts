import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminLayoutComponent } from './admin-layout.component';
import { ShareModule } from '../../shared/share.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AdminLayoutComponent],
  imports: [CommonModule, FormsModule, NgbModule, ShareModule, RouterModule],
})
export class AdminLayoutModule {}
