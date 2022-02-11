import { Component, OnInit } from '@angular/core';
import {Candidat} from "../model/Candidat";
import {PosteService} from "../poste.service";
import {FileService} from "../service/file.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {UserService} from "../service/user.service";
import {NotificationService} from "../service/notification.service";
import {AddPostService} from "../add-post.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";
import {Poste} from "../poste";

@Component({
  selector: 'app-candidat',
  templateUrl: './candidat.component.html',
  styleUrls: ['./candidat.component.css']
})
export class CandidatComponent implements OnInit {

  candidats!: Candidat[];
  closeResult!: string;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) {

  }

  getCandidats() {
    this.httpClient.get<any>('http://localhost:8087/candidats').subscribe(
      response => {
        console.log(response);
        this.candidats = response;
      }
    );
  }

  ngOnInit(): void {
    this.getCandidats();
  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:8087/candidats/addnew';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  // @ts-ignore
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
