import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoomsComponent } from './rooms.component';
import { RoomsRoutingModule } from './rooms-routing.module';
import { ShareModule } from '../../shared/share.module';

@NgModule({
  declarations: [RoomsComponent],
  imports: [
    CommonModule,
    RoomsRoutingModule,
    FormsModule,
    NgbModule,
    ShareModule,
  ],
})
export class RoomsModule {}
