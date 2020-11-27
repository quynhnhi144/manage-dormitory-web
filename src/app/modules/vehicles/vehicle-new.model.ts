import { VehicleBill } from '../../shared/model/vehicle-bill.model';
export class VehicleNew {
  licensePlates: string;
  typeVehicleId: number;
  vehiclePriceId: number;
  vehicleBillDto: VehicleBill;
  constructor(init?: Partial<VehicleNew>) {
    Object.assign(this, init);
  }
}
