import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../shared/share.module';
@NgModule({
  declarations: [HomePageComponent],
  imports: [CommonModule, FormsModule, RouterModule, ShareModule],
})
export class HomePageModule {}
