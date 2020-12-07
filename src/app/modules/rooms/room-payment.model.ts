import { StudentBill } from '../students/student-bill.model';

export class RoomPayment {
  roomId: number;
  roomName: string;
  studentBills: StudentBill[];

  constructor(init?: Partial<RoomPayment>) {
    Object.assign(this, init);
  }
}
