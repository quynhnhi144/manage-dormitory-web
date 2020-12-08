import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthInterceptorService } from './core/interceptor/auth-interceptor.service';
import { DashboardService } from './modules/dashboard/dashboard.service';
import { CampusService } from './core/services/campus.service';
import { TypeRoomService } from './core/services/typeroom.service';
import { RoomWaterMoneyService } from './core/services/room-water-money.service';
import { RoomService } from './modules/rooms/room.service';
import { StudentsService } from './modules/students/students.service';
import { PowerBillsService } from './modules/power-bills/power-bills.service';
import { VehicleService } from './modules/vehicles/vehicle.service';
import { UserService } from './modules/users/user.service';
import { RemainingRoomService } from './modules/remaining-rooms/remaining-room.service';
import { PriceListService } from './modules/price-list/price-list.service';
import { EMailService } from './modules/e-mail/e-mail.service';
@NgModule({
  providers: [
    DashboardService,
    RoomService,
    StudentsService,
    PowerBillsService,
    VehicleService,
    UserService,
    PriceListService,
    EMailService,
    RemainingRoomService,
    CampusService,
    TypeRoomService,
    RoomWaterMoneyService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
})
export class CoreModule {}
