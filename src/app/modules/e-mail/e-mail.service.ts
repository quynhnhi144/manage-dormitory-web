import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { HttpClient } from '@angular/common/http';
import { EMail } from './e-mail.model';

@Injectable({ providedIn: 'root' })
export class EMailService {
  baseUrl = GlobalConstants.apiURL;
  constructor(private httpClient: HttpClient) {}

  getAllEMails(skip: number, take: number, searchText: string) {
    let url =
      this.baseUrl + '/mails?' + '&skip=' + skip + '&take=' + take + searchText;
    return this.httpClient.get(url);
  }

  getMail(id: number) {
    let url = this.baseUrl + '/mails' + '/' + id;
    return this.httpClient.get(url);
  }

  addMail(mail: EMail) {
    let url = this.baseUrl + '/mails' + '/addMail';
    return this.httpClient.post<EMail>(url, mail);
  }

  updateMail(mailId: number, mail: EMail) {
    let url = this.baseUrl + '/mails' + '/' + mailId;
    return this.httpClient.put(url, mail);
  }

  deleteMail(mailId: number) {
    let url = this.baseUrl + '/mails' + '/' + mailId;
    return this.httpClient.delete(url);
  }

  sendEMail(mailId: number) {
    let url = this.baseUrl + '/mails' + '/sendMail' + '/' + mailId;
    return this.httpClient.get(url);
  }
}
