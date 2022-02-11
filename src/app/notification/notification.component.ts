import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {


  emailNotification: Infos =
    {
      name: '',
      email: '',
    };
  selectedValue: any;
  constructor(private https: HttpClient) { }
  onSubmit(){
    this.https.post<Infos>('http://localhost:8087/sendEmail/getdetails', this.emailNotification).subscribe(
      res => {
        this.emailNotification = res;
        console.log(this.emailNotification);
        alert('Email Sent successfully');
        location.reload();

      },
      err => {
        alert('An error has occured while sending email');
      });
    console.log("email sent");
  }
  ngOnInit(): void {
  }
}
interface Infos{
  name:string;

  email:string;


}
