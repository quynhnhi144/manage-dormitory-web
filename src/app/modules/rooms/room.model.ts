import { Student } from '../students/student.model';
export class Room {
  id: number;
  name: string;
  quantityStudent: number;
  priceRoom: number;
  priceWater: number;
  priceVehicle: number;
  pricePower: number;
  campusName: string;
  userManager: string;
  typeRoom: any;
  students: Student[];
  isPayRoom: boolean;
  isPayWaterBill: boolean;

  constructor(init?: Partial<Room>) {
    Object.assign(this, init);
  }
}
