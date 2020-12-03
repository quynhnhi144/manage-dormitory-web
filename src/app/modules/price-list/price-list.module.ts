import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShareModule } from '../../shared/share.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PriceListComponent } from './price-list.component';
import { PriceListRoutingModule } from './price-list-routing.module';

@NgModule({
  declarations: [PriceListComponent],
  imports: [
    CommonModule,
    PriceListRoutingModule,
    FormsModule,
    NgbModule,
    ShareModule,
    NgSelectModule,
  ],
})
export class PriceListModule {}
