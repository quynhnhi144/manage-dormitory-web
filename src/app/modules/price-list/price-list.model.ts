export class PriceList {
  id: number;
  name: string;
  price: number;

  constructor(init?: Partial<PriceList>) {
    Object.assign(this, init);
  }
}
