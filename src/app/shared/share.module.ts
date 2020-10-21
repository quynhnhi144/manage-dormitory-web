import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [SidebarComponent, NavbarComponent, SpinnerComponent],
  imports: [CommonModule, NgbModule, RouterModule],
  exports: [SidebarComponent, NavbarComponent, SpinnerComponent],
})
export class ShareModule {}
