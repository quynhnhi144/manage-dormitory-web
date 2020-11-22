import { WaterBill } from '../../shared/model/water-bill.model';
import { RoomBill } from '../../shared/model/room-bill.model';
import { StudentDto } from './student-dto.model';
export class StudentNew {
  studentDto: StudentDto;
  waterBillDto: WaterBill;
  roomBillDto: RoomBill;

  constructor(init?: Partial<StudentNew>) {
    Object.assign(this, init);
  }
}
