import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FindRoomComponent } from './find-room.component';
import { FindRoomRoutingModule } from './find-room.routing.module';

@NgModule({
  declarations: [FindRoomComponent],
  imports: [CommonModule, FormsModule, FindRoomRoutingModule],
})
export class FindRoomModule {}
