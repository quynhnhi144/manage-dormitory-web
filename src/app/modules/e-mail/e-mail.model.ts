export class EMail {
  id: number;
  subject: string;
  content: string;
  constructor(init?: Partial<EMail>) {
    Object.assign(this, init);
  }
}
