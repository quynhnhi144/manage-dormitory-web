import { RoomUpdate } from '../rooms/room-update.model';
export class Student {
  id: number;
  name: string;
  birthday: Date;
  phone: string;
  email: string;
  address: string;
  startingDateOfStay: Date;
  endingDateOfStay: Date;
  roomDto: RoomUpdate;
  isPayRoom: boolean;
  isPayWaterBill: boolean;
  isPayVehicleBill: boolean;
  isPayPowerBill: boolean;

  constructor(init?: Partial<Student>) {
    Object.assign(this, init);
  }
}
