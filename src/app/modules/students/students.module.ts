import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [StudentsComponent],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule,
  ],
  exports: [BsDatepickerModule],
})
export class StudentsModule {}
