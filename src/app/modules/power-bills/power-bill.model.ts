import { RoomDto } from '../rooms/room-dto.model';
export class PowerBill {
  roomDto: RoomDto;
  billId: number;
  startDate: Date;
  endDate: Date;
  numberOfPowerBegin: number;
  numberOfPowerEnd: number;
  numberOfPowerUsed: number;
  priceAKWH: number;
  numberOfMoneyMustPay: number;
  pay: boolean;

  constructor(init?: Partial<PowerBill>) {
    Object.assign(this, init);
  }
}
