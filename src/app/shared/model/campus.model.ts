export class Campus {
  id: number;
  name: string;
  usermanager: string;
  constructor(init?: Partial<Campus>) {
    Object.assign(this, init);
  }
}
