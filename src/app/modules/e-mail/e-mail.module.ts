import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { EMailComponent } from './e-mail.component';
import { EMailRoutingModule } from './e-mail-routing.module';

@NgModule({
  declarations: [EMailComponent],
  imports: [
    CommonModule,
    EMailRoutingModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  exports: [BsDatepickerModule],
})
export class EMailModule {}
