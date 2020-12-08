import { Component, OnInit } from '@angular/core';
import { EMail } from './e-mail.model';
import { NotificationService } from '../../core/services/notification.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { EMailService } from './e-mail.service';

@Component({
  selector: 'app-e-mail',
  templateUrl: './e-mail.component.html',
  styleUrls: ['./e-mail.component.scss'],
})
export class EMailComponent implements OnInit {
  loadingFlag = false;
  searchText: string = '';
  mails: EMail[] = [];
  mailTotal = 0;
  pageSize: number = 5;
  page: number = 1;
  skip = 0;
  isClickSearch = false;
  subscription: Subscription;
  modalOption: NgbModalOptions = {};
  currentMailId = 0;
  isNewMail = false;

  modalMail = new EMail();
  modalUpdateMail = new EMail();
  mailError = null;

  constructor(
    private notificationService: NotificationService,
    private modalService: NgbModal,
    private emailService: EMailService
  ) {}

  ngOnInit(): void {
    this.getAllMails();
  }

  getAllMails(page = 1) {
    this.loadingFlag = true;
    this.page = page;
    this.skip = (page - 1) * this.pageSize;
    let paramSubject = this.isClickSearch ? `$subject=${this.searchText}` : ``;
    this.subscription = this.emailService
      .getAllEMails(this.skip, this.pageSize, paramSubject)
      .subscribe(
        (data: any) => {
          console.log(data);
          this.mails = data.data.data;
          this, (this.mailTotal = data.total);
          this.loadingFlag = false;
        },
        (error) => {
          console.log(error);
          this.loadingFlag = false;
        }
      );
  }

  resetPage() {
    this.page = 1;
    this.getAllMails();
  }

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.getAllMails(pageNumber);
  }

  onSearch(event) {
    this.isClickSearch = true;
    this.getAllMails();
  }

  // open modal
  openModal(modalName) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(modalName, this.modalOption);
  }

  getDetailMail() {
    this.subscription = this.emailService.getMail(this.currentMailId).subscribe(
      (data: any) => {
        this.modalMail = data;
        this.modalUpdateMail = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openModalDetailMail(modalDetailAMail, mail: any) {
    this.currentMailId = mail.id;
    this.getDetailMail();
    this.openModal(modalDetailAMail);
  }

  openNewmail(modalUpdateAMail) {
    this.isNewMail = true;
    this.modalUpdateMail = new EMail({
      id: null,
      subject: null,
      content: null,
    });
    this.openModal(modalUpdateAMail);
  }

  openModalUpdateAMail(modalUpdateAMail, mail: any) {
    this.currentMailId = mail.id;
    this.isNewMail = false;
    this.getDetailMail();
    this.openModal(modalUpdateAMail);
  }

  saveChange() {
    if (!this.modalUpdateMail.subject) {
      this.mailError = 'Tiêu đề là buộc';
      this.turnOffNotification();
      return;
    }

    if (!this.modalUpdateMail.content) {
      this.mailError = 'Nội dung là bắt buộc';
      this.turnOffNotification();
      return;
    }

    if (!this.isNewMail) {
      let mailUpdate = new EMail({
        id: this.modalUpdateMail.id,
        subject: this.modalUpdateMail.subject,
        content: this.modalUpdateMail.content,
      });
      this.subscription = this.emailService
        .updateMail(this.currentMailId, mailUpdate)
        .subscribe(
          (data: any) => {
            console.log('mail update: ', data);
            let index = this.mails.findIndex(
              (mail) => mail.id === this.currentMailId
            );
            this.mails[index] = data;
            this.modalService.dismissAll();
            this.notificationService.sendNotificationMessage({
              message: 'Đã cập nhật mail thành công !!!',
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
    } else {
      let newMail: EMail = {
        id: null,
        subject: this.modalUpdateMail.content,
        content: this.modalUpdateMail.content,
      };
      this.subscription = this.emailService.addMail(newMail).subscribe(
        (data: any) => {
          this.getAllMails();
          this.modalService.dismissAll();
          this.notificationService.sendNotificationMessage({
            message: 'Đã tạo mail thành công !!!',
            isSuccess: true,
          });
        },
        (error) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message: 'Đã xảy ra lỗi. Hãy kiểm tra lại !!!',
            isSuccess: false,
          });
        }
      );
    }
  }

  deleteMail(mail: any) {
    this.currentMailId = mail.id;
    this.subscription = this.emailService
      .deleteMail(this.currentMailId)
      .subscribe(
        (data: any) => {
          this.getAllMails();
          this.notificationService.sendNotificationMessage({
            message: 'Đã xóa mail thành công !!!',
            isSuccess: true,
          });
        },
        (error) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message: 'Đã xảy ra lỗi. Hãy kiểm tra lại !!!',
            isSuccess: false,
          });
        }
      );
  }

  sendMail(mail: any) {
    this.currentMailId = mail.id;
    this.subscription = this.emailService
      .sendEMail(this.currentMailId)
      .subscribe(
        (data) => {
          console.log(data);
          this.notificationService.sendNotificationMessage({
            message: 'Đã gửi mail thành công !!!',
            isSuccess: true,
          });
        },
        (error) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message: 'Đã xảy ra lỗi. Hãy kiểm tra lại !!!',
            isSuccess: false,
          });
        }
      );
  }

  turnOffNotification() {
    setTimeout(() => {
      this.mailError = '';
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
