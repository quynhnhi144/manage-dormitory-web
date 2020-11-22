export class WaterBill {
  billId: number;
  studentName: string;
  studentId: number;
  startDate: Date;
  endDate: Date;
  price: number;
  roomId: number;
  constructor(init?: Partial<WaterBill>) {
    Object.assign(this, init);
  }
}
