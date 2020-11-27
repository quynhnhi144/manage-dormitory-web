import { StudentDto } from '../students/student-dto.model';
export class Vehicle {
  id: number;
  licensePlates: string;
  typeVehicle: any;
  studentDto: StudentDto;
  roomName: string;
  campusName: string;
  userManager: string;
  startDate: Date;
  endDate: Date;
  isPayVehicleBill: boolean;
  active: boolean;
  constructor(init?: Partial<Vehicle>) {
    Object.assign(this, init);
  }
}
