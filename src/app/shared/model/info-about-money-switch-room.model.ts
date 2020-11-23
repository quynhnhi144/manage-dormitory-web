export class InforAboutMoneySwitchRoom {
  oldRoomId: number;
  newRoomId: number;
  roomStartDate: Date;
  roomEndDate: Date;
  durationRoomMoney: number;

  waterStartDate: Date;
  waterEndDate: Date;
  durationWaterMoney: number;

  vehicleStartDate: Date;
  vehicleEndDate: Date;
  durationVehicleMoney: number;

  oldRoomName?: string;
  newStringName?: string;

  constructor(init?: Partial<InforAboutMoneySwitchRoom>) {
    Object.assign(this, init);
  }
}
