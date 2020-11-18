import { Room } from '../rooms/room.model';
export class PowerBill {
  detailRoomDto: Room;
  billId: number;
  startDate: Date;
  endDate: Date;
  numberOfPowerBegin: number;
  numberOfPowerEnd: number;
  numberOfPowerUsed: number;
  priceList: any;
  numberOfMoneyMustPay: number;
  pay: boolean;

  constructor(init?: Partial<PowerBill>) {
    Object.assign(this, init);
  }
}
