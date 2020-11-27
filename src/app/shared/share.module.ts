import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './spinner/spinner.component';
import { ModalComponent } from './modal/modal.component';
import { PositiveNumber } from '../common/positive-number.pipe';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    SpinnerComponent,
    ModalComponent,
    PositiveNumber,
  ],
  imports: [CommonModule, NgbModule, RouterModule],
  exports: [
    SidebarComponent,
    NavbarComponent,
    SpinnerComponent,
    ModalComponent,
    PositiveNumber,
  ],
})
export class ShareModule {}
