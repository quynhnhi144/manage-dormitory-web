import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FindRoomComponent } from './find-room.component';
import { FindRoomRoutingModule } from './find-room.routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [FindRoomComponent],
  imports: [
    CommonModule,
    FormsModule,
    FindRoomRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class FindRoomModule {}
