import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PowerBillsComponent } from './power-bills.component';
import { PowerBillsRoutingModule } from './power-bills-routing.module';

@NgModule({
  declarations: [PowerBillsComponent],
  imports: [CommonModule, PowerBillsRoutingModule, FormsModule, NgbModule],
})
export class PowerBillsModule {}
