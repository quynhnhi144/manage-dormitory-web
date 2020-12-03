import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../common/global-constants';
import { CampusService } from '../../core/services/campus.service';
import { Subscription } from 'rxjs';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle.model';
import { Student } from '../students/student.model';
import { NotificationService } from '../../core/services/notification.service';
import { VehicleLeft } from './vehicle-left.model';
import { StudentDto } from '../students/student-dto.model';
import { StudentsService } from '../students/students.service';
import { VehicleBill } from '../../shared/model/vehicle-bill.model';
import { endOf } from 'ngx-bootstrap/chronos';
import { VehicleNew } from './vehicle-new.model';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
})
export class VehiclesComponent implements OnInit {
  vehicles;
  vehicleTotal = 5;
  campusIndex = 0;
  campusType = 'all';
  page: number = 1;
  skip = 0;
  pageSize = 10;
  campuses;
  searchText = '';

  isClickSearch = false;
  isClickBtnTypeVehicle = false;
  typeOfVehicle = '';
  //modal
  modalVehicle = new Vehicle();
  message = '';
  currentVehicleId = 0;

  typeOfVehicleList = [
    { id: 1, name: 'Xe máy' },
    { id: 2, name: 'Xe đạp' },
  ];

  typeVehicleId: number;

  modalVehicleUpdate = new Vehicle();
  subscription: Subscription;

  isNewVehicle = false;

  vehicleUpdateError = null;

  vehicleLeft = new VehicleLeft();

  studentList: Student[] = [];

  studentId: number;

  responseVehicleInfo = new VehicleBill();

  constructor(
    private modalService: NgbModal,
    private campusService: CampusService,
    private vehicleService: VehicleService,
    private notificationService: NotificationService,
    private studentService: StudentsService
  ) {}

  ngOnInit(): void {
    this.getAllCampuses();
    this.getAllVehicle(0, 'all', 1);
  }

  getAllCampuses() {
    this.subscription = this.campusService.getAllCampuses().subscribe(
      (data: any) => {
        this.campuses = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllVehicle(campusIndex, campusType, page = 1) {
    this.campusIndex = campusIndex;
    this.campusType = campusType;
    let choosedCampus = '';

    if (campusType !== 'all') {
      choosedCampus = '&campusName=' + campusType;
    }

    this.page = page;
    this.skip = (page - 1) * this.pageSize;
    let paramSearchText = this.isClickSearch
      ? `&searchText=${this.searchText}`
      : ``;

    let paramTypeRoom = this.isClickBtnTypeVehicle
      ? `&typeVehicle=${this.typeOfVehicle}`
      : ``;

    this.subscription = this.vehicleService
      .getAllVehicle(
        this.skip,
        this.pageSize,
        choosedCampus,
        paramSearchText,
        paramTypeRoom
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.vehicles = data.data.data;
          console.log('vehicles:', this.vehicles);
          this.vehicleTotal = data.total;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onSearch(event) {
    this.isClickSearch = true;
    this.getAllVehicle(this.campusIndex, this.campusType);
  }

  resetPage() {
    this.page = 1;
    this.getAllVehicle(this.campusIndex, this.campusType);
  }

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.getAllVehicle(this.campusIndex, this.campusType, pageNumber);
  }

  resetPageByTypeOfVehicle(typeOfVehicle: string) {
    this.isClickBtnTypeVehicle = true;
    this.typeOfVehicle = typeOfVehicle;
    this.getAllVehicle(this.campusIndex, this.campusType);
  }

  // open modal
  openModal(modalName) {
    this.modalService.open(modalName);
  }

  // modal room detail
  openModalDetailVehicle(modalDetailAVehicle, vehicle: any) {
    this.currentVehicleId = vehicle.id;
    this.getDetailAVehicle();
    this.openModal(modalDetailAVehicle);
  }

  getDetailAVehicle() {
    this.subscription = this.vehicleService
      .getAVehicle(this.currentVehicleId)
      .subscribe(
        (data: any) => {
          console.log('detailStudent: ', data);
          this.modalVehicle = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // modal update room
  openModalUpdateARoom(modalUpdateAVehicle, vehicle: any) {
    this.currentVehicleId = vehicle.id;
    this.getUpdateVehicle();
    this.openModal(modalUpdateAVehicle);
  }

  getUpdateVehicle() {
    this.subscription = this.vehicleService
      .getAVehicle(this.currentVehicleId)
      .subscribe(
        (data: any) => {
          console.log('detailStudent: ', data);
          this.modalVehicleUpdate = data;
          this.typeVehicleId = this.modalVehicleUpdate.typeVehicle.id;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  saveChange() {
    if (!this.modalVehicleUpdate.licensePlates) {
      this.vehicleUpdateError = 'License Plates is required';
      this.turnOffNotification();
      return;
    }

    if (!this.typeVehicleId) {
      this.vehicleUpdateError = 'Type vehicle is required';
      this.turnOffNotification();
      return;
    }

    if (!this.isNewVehicle) {
      let indexTypeVehicle = this.typeOfVehicleList.findIndex(
        (x) => x.id === this.typeVehicleId
      );
      let typeVehicle = this.typeOfVehicleList[indexTypeVehicle];
      let vehicleUpdate = {
        id: this.modalVehicleUpdate.id,
        licensePlates: this.modalVehicleUpdate.licensePlates,
        typeVehicle: typeVehicle,
        studentDto: this.modalVehicleUpdate.studentDto,
        roomName: this.modalVehicleUpdate.roomName,
        campusName: this.modalVehicleUpdate.campusName,
        userManager: this.modalVehicleUpdate.userManager,
        startDate: this.modalVehicleUpdate.startDate,
        endDate: this.modalVehicleUpdate.endDate,
        isPayVehicleBill: this.modalVehicleUpdate.isPayVehicleBill,
        active: this.modalVehicleUpdate.active,
      };

      this.subscription = this.vehicleService
        .updateVehicle(this.currentVehicleId, vehicleUpdate)
        .subscribe(
          (data: Vehicle) => {
            console.log('vehicle update: ' + data);
            let index = this.vehicles.findIndex(
              (vehicle) => vehicle.id === this.currentVehicleId
            );
            this.vehicles[index] = data;
            this.modalService.dismissAll();
            this.notificationService.sendNotificationMessage({
              message: 'Đã cập nhật thông tin xe thành công !!!',
              isSuccess: true,
            });
          },
          (error) => {
            console.log(error);
            this.notificationService.sendNotificationMessage({
              message: 'Đã xảy ra lỗi !!!',
              isSuccess: false,
            });
          }
        );
    } else {
      let vehicleBill = new VehicleBill({
        billId: null,
        studentName: null,
        studentId: this.studentId,
        vehicleId: null,
        startDate: this.responseVehicleInfo.startDate,
        endDate: this.responseVehicleInfo.endDate,
        price: this.responseVehicleInfo.price,
        roomId: null,
      });
      let vehicleNew = new VehicleNew({
        licensePlates: this.modalVehicleUpdate.licensePlates,
        typeVehicleId: this.typeVehicleId,
        vehiclePriceId: 3,
        vehicleBillDto: vehicleBill,
      });

      this.subscription = this.vehicleService.addVehicle(vehicleNew).subscribe(
        (data: any) => {
          console.log('new vehicle: ' + data);
          this.modalService.dismissAll();
          this.notificationService.sendNotificationMessage({
            message: 'Đã thêm xe thành công !!!',
            isSuccess: true,
          });
        },
        (error) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message: 'Đã xảy ra lỗi !!!',
            isSuccess: false,
          });
        }
      );
    }
  }

  turnOffNotification() {
    setTimeout(() => {
      this.vehicleUpdateError = '';
    }, 5000);
  }

  openModalDeleteVehicle(modalDeleteVehicle, vehicle: any) {
    this.currentVehicleId = vehicle.id;
    this.getVehicleBill();
    this.openModal(modalDeleteVehicle);
  }

  getVehicleBill() {
    this.subscription = this.vehicleService
      .getVehicleWanttoUnactive(this.currentVehicleId)
      .subscribe(
        (data: any) => {
          console.log('vehicleLeft: ' + data);
          this.vehicleLeft = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  saveDelete() {
    this.subscription = this.vehicleService
      .unActiveVehicle(this.vehicleLeft)
      .subscribe(
        (data: any) => {
          console.log('data: ' + data);
          let index = this.vehicles.findIndex(
            (vehicle) => vehicle.id === this.vehicleLeft.id
          );

          this.vehicles[index].active = !this.vehicles[index].active;
          this.modalService.dismissAll();
          this.notificationService.sendNotificationMessage({
            message: 'Đã đổi trạng thái sinh viên thành công !!!',
            isSuccess: true,
          });
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

  createNewVehicle(modalUpdateAVehicle) {
    this.isNewVehicle = true;
    this.modalVehicleUpdate = new Vehicle({
      id: null,
      licensePlates: null,
      typeVehicle: null,
      studentDto: new StudentDto(),
      roomName: null,
      campusName: null,
      userManager: null,
      startDate: new Date(),
      endDate: new Date(),
      isPayVehicleBill: false,
      active: true,
    });
    this.subscription = this.studentService.getTotalStudents().subscribe(
      (data: any) => {
        this.studentList = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.openModal(modalUpdateAVehicle);
  }

  showPaymentVehicle() {
    this.subscription = this.vehicleService
      .getPaymentVehicle(this.studentId)
      .subscribe(
        (data: any) => {
          console.log('paymentVehicle: ' + data);
          this.responseVehicleInfo = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  exportExcelFile() {
    this.subscription = this.vehicleService.exportExcelFile().subscribe(
      (response: any) => {
        this.downloadFile(
          response,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'vehicles.xlsx'
        );
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  downloadFile(data: any, type: string, fileName: string) {
    let blob = new Blob([data], { type: type });
    FileSaver.saveAs(blob, fileName);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
