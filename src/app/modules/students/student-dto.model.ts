import { RoomDto } from '../rooms/room-dto.model';
import { WaterBill } from '../../shared/model/water-bill.model';
import { RoomBill } from '../../shared/model/room-bill.model';
export class StudentDto {
  id: number;
  name: string;
  birthday: Date;
  phone: string;
  email: string;
  address: string;
  startingDateOfStay: Date;
  endingDateOfStay: Date;
  roomId: number;
  waterPriceId: number;
  waterBill: WaterBill;
  roomBill: RoomBill;

  constructor(init?: Partial<StudentDto>) {
    Object.assign(this, init);
  }
}
