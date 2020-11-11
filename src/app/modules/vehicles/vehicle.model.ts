export class Vehicle {
  id: number;
  licensePlates: string;
  typeVehicle: string;
  studentId: number;
  studentName: string;
  roomName: string;
  campusName: string;
  userManager: string;
  startDate: Date;
  endDate: Date;
  isPayVehicleBill: boolean;

  constructor(init?: Partial<Vehicle>) {
    Object.assign(this, init);
  }
}
