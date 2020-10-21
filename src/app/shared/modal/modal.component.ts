import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() modalName;
  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  openMediumModal(mediumModalContent) {
    this.modalService.open(mediumModalContent);
  }
}
