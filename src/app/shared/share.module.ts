import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SidebarComponent, NavbarComponent],
  imports: [CommonModule, NgbModule, RouterModule],
  exports: [SidebarComponent, NavbarComponent],
})
export class ShareModule {}
