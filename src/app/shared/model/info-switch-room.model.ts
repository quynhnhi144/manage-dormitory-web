import { RoomBill } from './room-bill.model';
import { WaterBill } from './water-bill.model';
import { VehicleBill } from './vehicle-bill.model';
export class InfoSwitchRoom {
  studentId: number;
  studentName: string;
  oldRoomId: number;
  oldRoomName: string;
  newRoomId: number;
  newRoomName: string;
  roomBill: RoomBill;
  waterBill: WaterBill;
  vehicleBill: VehicleBill;
  constructor(init?: Partial<InfoSwitchRoom>) {
    Object.assign(this, init);
  }
}
