import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PowerBillsComponent } from './power-bills.component';
import { PowerBillsRoutingModule } from './power-bills-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [PowerBillsComponent],
  imports: [
    CommonModule,
    PowerBillsRoutingModule,
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [BsDatepickerModule],
})
export class PowerBillsModule {}
