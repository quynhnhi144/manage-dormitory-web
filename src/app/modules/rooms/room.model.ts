import { Student } from '../students/student.model';
export class Room {
  roomId: number;
  roomName: string;
  quantityStudent: number;
  priceRoom: number;
  campusName: string;
  userManager: string;
  typeRoom: any;
  students: Student[];
  isPayRoom: boolean;
  isPayWaterBill: boolean;
  isPayVehicleBill: boolean;
  isPayPowerBill: boolean;
  constructor(init?: Partial<Room>) {
    Object.assign(this, init);
  }
}
