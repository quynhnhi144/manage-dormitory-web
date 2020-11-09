export class RoomDto {
  id: number;
  name: string;
  quantityStudent: number;
  typeRoomName: string;
  campusName: string;
  userManager: string;
  isPayRoom: boolean;
  isPayWaterBill: boolean;
  isPayVehicleBill: boolean;
  isPayPowerBill: boolean;

  constructor(init?: Partial<RoomDto>) {
    Object.assign(this, init);
  }
}
