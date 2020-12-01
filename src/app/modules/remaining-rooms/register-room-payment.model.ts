import { RegisterRoom } from './register-room.model';
import { MoneyRoomAndMoneyWater } from '../../shared/model/money-room-and-money-water.model';
export class RegisterRoomPayment {
  registerRoomDto: RegisterRoom;
  roomPriceAndWaterPriceDto: MoneyRoomAndMoneyWater;

  constructor(init?: Partial<RegisterRoomPayment>) {
    Object.assign(this, init);
  }
}
