export class RoomBill {
  billId: number;
  studentName: string;
  studentId: number;
  studentIdCard: string;
  startDate: Date;
  endDate: Date;
  price: number;
  roomId: number;
  maxQuantity: number;
  constructor(init?: Partial<RoomBill>) {
    Object.assign(this, init);
  }
}
