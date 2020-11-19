import { RoomDto } from '../rooms/room-dto.model';
export class Student {
  id: number;
  name: string;
  birthday: Date;
  phone: string;
  email: string;
  address: string;
  startingDateOfStay: Date;
  endingDateOfStay: Date;
  roomDto: RoomDto;
  isPayRoom: boolean;
  isPayWaterBill: boolean;
  isPayVehicleBill: boolean;
  isPayPowerBill: boolean;
  active: boolean;

  constructor(init?: Partial<Student>) {
    Object.assign(this, init);
  }
}
