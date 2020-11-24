import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../users/user.service';
import { CampusService } from '../../core/services/campus.service';
import { forkJoin, Subscription } from 'rxjs';
import { User } from '../users/user.model';
import { RoomService } from '../rooms/room.service';
import { Room } from '../rooms/room.model';
import { StudentsService } from '../students/students.service';
import { VehicleService } from '../vehicles/vehicle.service';
import { Student } from '../students/student.model';
import { Vehicle } from '../vehicles/vehicle.model';
import { DashboardService } from './dashboard.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dashboard = {
    totalNumberUser: 10,
    totalNumberCampus: 10,
    totalNumberRoom: 10,
    totalNumberVehicle: 10,
    totalNumberStudent: 10,
    totalNumberRemainingRoom: 10,
  };
  users: User[] = [];
  campuses = [];

  rooms: Room[] = [];
  remainingRooms: Room[] = [];

  students: Student[] = [];
  vehicles: Vehicle[] = [];

  subscription: Subscription;
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private campusService: CampusService,
    private roomService: RoomService,
    private studentService: StudentsService,
    private vehicleService: VehicleService,
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getDashBoard();
  }

  getDashBoard() {
    this.subscription = this.dashboardService.getDashboard().subscribe(
      (data: any) => {
        console.log('dashboard: ', data);
        this.dashboard = data;
      },
      (error) => {
        console.log(error);
        this.notificationService.sendNotificationMessage({
          message: 'Có lỗi xảy ra !!!',
          isSuccess: false,
        });
      }
    );
  }

  openModalUserCampus(modalUserCampus) {
    this.modalService.open(modalUserCampus);
    this.getAllUsersAndCampuses();
  }

  getAllUsersAndCampuses() {
    this.subscription = forkJoin([
      this.userService.getTotalUsers(),
      this.campusService.getAllCampuses(),
    ]).subscribe((data: any) => {
      console.log('users and campuses: ', data);
      this.users = data[0];
      this.campuses = data[1];
    });
  }

  openModalRoomAndRemainingRoom(modalRoomRemainingRoom) {
    this.modalService.open(modalRoomRemainingRoom);
    this.getAllRoomsAndRemainingRooms();
  }

  getAllRoomsAndRemainingRooms() {
    this.subscription = forkJoin([
      this.roomService.getTotalRooms(),
      this.roomService.getTotalRemainingRooms(),
    ]).subscribe((data: any) => {
      console.log('rooms and remaining rooms: ', data);
      this.rooms = data[0];
      this.remainingRooms = data[1];
    });
  }

  openModalStudentVehicle(modalStudentVehicle) {
    this.modalService.open(modalStudentVehicle);
    this.getAllStudentsAndVehicles();
  }
  getAllStudentsAndVehicles() {
    this.subscription = forkJoin([
      this.studentService.getTotalStudents(),
      this.vehicleService.getTotalVehicles(),
    ]).subscribe((data: any) => {
      console.log('students and vehicles: ', data);
      this.students = data[0];
      this.vehicles = data[1];
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
