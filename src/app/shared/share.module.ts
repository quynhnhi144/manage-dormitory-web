import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './spinner/spinner.component';
import { ModalComponent } from './modal/modal.component';
import { PositiveNumber } from '../common/positive-number.pipe';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    SpinnerComponent,
    ModalComponent,
    PositiveNumber,
    HeaderComponent,
  ],
  imports: [CommonModule, NgbModule, RouterModule],
  exports: [
    SidebarComponent,
    NavbarComponent,
    SpinnerComponent,
    ModalComponent,
    PositiveNumber,
    HeaderComponent,
  ],
})
export class ShareModule {}
