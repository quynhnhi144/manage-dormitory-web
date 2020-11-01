export class Student {
  id: number;
  name: string;
  birthday: Date;
  phone: string;
  email: string;
  address: string;
  startingDateOfStay: Date;
  endingDateOfStay: Date;
  roomName: string;
  campusName: string;
  typeRoom: string;
  userManager: string;
  isPayRoom: boolean;
  isPayWaterBill: boolean;
  isPayVehicleBill: boolean;
  isPayPowerBill: boolean;

  constructor(init?: Partial<Student>) {
    Object.assign(this, init);
  }
}
