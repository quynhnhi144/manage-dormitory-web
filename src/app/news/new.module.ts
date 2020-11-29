import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsComponent } from './news.component';
import { NewsRoutingModule } from './new-routing.module';

@NgModule({
  declarations: [NewsComponent],
  imports: [CommonModule, FormsModule, NewsRoutingModule],
})
export class NewsModule {}
