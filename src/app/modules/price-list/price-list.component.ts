import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PriceListService } from './price-list.service';
import { PriceList } from './price-list.model';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss'],
})
export class PriceListComponent implements OnInit {
  priceList = [];
  priceListTotal = 5;
  page: number = 1;
  skip = 0;
  pageSize = 10;
  searchText: string = '';
  isClickSearch = false;
  isNewPriceList = false;
  currentPriceListId = 0;
  priceListError: string = null;

  modalPriceList = new PriceList();

  modalUpdatePriceList = new PriceList();

  modalOption: NgbModalOptions = {};

  subscription: Subscription;

  constructor(
    private priceListService: PriceListService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getAllPriceList(1);
  }

  getAllPriceList(page = 1) {
    this.page = page;
    this.skip = (page - 1) * this.pageSize;
    let paramSearchText = this.isClickSearch
      ? `&searchText=${this.searchText}`
      : ``;
    this.subscription = this.priceListService
      .getAllPriceList(this.skip, this.pageSize, paramSearchText)
      .subscribe(
        (data: any) => {
          this.priceList = data.data.data;
          this.priceListTotal = data.total;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onSearch(event) {
    this.isClickSearch = true;
    this.getAllPriceList();
  }

  resetPage() {
    this.page = 1;
    this.getAllPriceList();
  }

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.getAllPriceList(pageNumber);
  }

  // open modal
  openModal(modalName) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(modalName, this.modalOption);
  }

  // modal room detail
  openModalDetailUser(modalDetailAPriceList, priceList: any) {
    this.currentPriceListId = priceList.id;
    this.getDetailAPriceList();
    this.openModal(modalDetailAPriceList);
  }

  getDetailAPriceList() {
    this.subscription = this.priceListService
      .getDetailAPriceList(this.currentPriceListId)
      .subscribe(
        (data: any) => {
          this.modalPriceList = data;
          this.modalUpdatePriceList = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // modal room update
  openModalUpdatePriceList(modalUpdateAPriceList, priceList: any) {
    this.currentPriceListId = priceList.id;
    this.getDetailAPriceList();
    this.openModal(modalUpdateAPriceList);
  }

  saveChange() {
    if (!this.modalUpdatePriceList.name) {
      this.priceListError = 'Tên là bắt buộc';
      this.turnOffNotification();
      return;
    }
    if (!this.modalUpdatePriceList.price) {
      this.priceListError = 'Gía là bắt buộc';
      this.turnOffNotification();
      return;
    }
    if (!this.isNewPriceList) {
      let priceListUpdate = new PriceList({
        id: this.modalUpdatePriceList.id,
        name: this.modalUpdatePriceList.name,
        price: this.modalUpdatePriceList.price,
      });

      this.subscription = this.priceListService
        .updatePriceList(this.currentPriceListId, priceListUpdate)
        .subscribe(
          (data: any) => {
            let index = this.priceList.findIndex(
              (price) => price.id === this.currentPriceListId
            );
            this.priceList[index] = data;
            this.modalService.dismissAll();
            this.notificationService.sendNotificationMessage({
              message: 'Đã cập nhật thông tin khoản tiền thành công !!!',
              isSuccess: true,
            });
          },
          (error) => {
            console.log(error);
            this.notificationService.sendNotificationMessage({
              message: 'Đã xảy ra lỗi. Hãy thử lại !!!',
              isSuccess: false,
            });
          }
        );
    }
  }

  createPriceList(modalCreatePriceList) {
    this.openModal(modalCreatePriceList);
  }
  saveCreate() {
    this.subscription = this.priceListService
      .addPriceList(this.modalUpdatePriceList)
      .subscribe(
        (data: any) => {
          console.log('create PriceList: ', data);
          this.getAllPriceList();
          this.modalService.dismissAll();
          this.notificationService.sendNotificationMessage({
            message: 'Đã thêm khoản tiền thành công !!!',
            isSuccess: true,
          });
        },
        (error) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message: 'Đã xảy ra lỗi. Hãy thử lại !!!',
            isSuccess: false,
          });
        }
      );
  }

  turnOffNotification() {
    setTimeout(() => {
      this.priceListError = '';
    }, 5000);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
}
