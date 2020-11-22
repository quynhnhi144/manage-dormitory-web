export class MoneyRoomAndMoneyWater {
  id: number;
  roomStartDate: Date;
  roomEndDate: Date;
  moneyOfRoomMustPay: number;

  waterPriceId: number;
  waterStartDate: Date;
  waterEndDate: Date;
  moneyOfWaterMustPay: number;

  constructor(init?: Partial<MoneyRoomAndMoneyWater>) {
    Object.assign(this, init);
  }
}
