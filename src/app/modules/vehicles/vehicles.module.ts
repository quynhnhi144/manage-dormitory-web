import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VehiclesComponent } from './vehicles.component';
import { VehiclesRoutingModule } from './vehicles-routing.module';

@NgModule({
  declarations: [VehiclesComponent],
  imports: [CommonModule, VehiclesRoutingModule, FormsModule, NgbModule],
})
export class VehiclesModule {}
