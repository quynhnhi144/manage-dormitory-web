import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemainingRoomsComponent } from './remaining-rooms.component';
import { RemainingRoomsRoutingModule } from './remaining-rooms-routing.module';
import { ShareModule } from '../../shared/share.module';

@NgModule({
  declarations: [RemainingRoomsComponent],
  imports: [
    CommonModule,
    RemainingRoomsRoutingModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    ShareModule,
  ],
  exports: [BsDatepickerModule],
})
export class RemainingRoomsModule {}
