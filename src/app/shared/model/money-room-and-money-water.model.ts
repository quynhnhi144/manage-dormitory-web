export class MoneyRoomAndMoneyWater {
  id: number;
  roomName: string;

  roomStartDate: Date;
  roomEndDate: Date;
  moneyOfRoomMustPay: number;

  waterPriceId: number;
  waterStartDate: Date;
  waterEndDate: Date;
  moneyOfWaterMustPay: number;

  vehiclePriceId: number;
  vehicleStartDate: Date;
  vehicleEndDate: Date;
  moneyOfVehicleMustPay: number;

  maxQuantityStudent: number;

  constructor(init?: Partial<MoneyRoomAndMoneyWater>) {
    Object.assign(this, init);
  }
}
