import { Room } from '../modules/rooms/room.model';
export class RoomAndRegisterCount {
  detailRoomDto: Room;
  count: number;
  constructor(init?: Partial<RoomAndRegisterCount>) {
    Object.assign(this, init);
  }
}
