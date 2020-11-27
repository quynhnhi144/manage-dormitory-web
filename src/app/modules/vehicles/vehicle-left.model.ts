export class VehicleLeft {
  id: number;
  licensePlates: string;
  studentName: string;
  leavingDate: Date;
  numberOfVehicleMoney: number;
  studentId: number;
  constructor(init?: Partial<VehicleLeft>) {
    Object.assign(this, init);
  }
}
