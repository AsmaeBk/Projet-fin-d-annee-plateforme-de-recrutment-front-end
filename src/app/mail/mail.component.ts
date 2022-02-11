import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {
  title = 'EmailTemplate';
  dataset: Details = {
    name:'',
    age:0,
    country:'',
    email:''
  };
  constructor(private https: HttpClient) { }
  onSubmit(){
    this.https.post<Details>('http://localhost:8087/testapp/getdetails', this.dataset).subscribe(
      res => {
        this.dataset = res;
        console.log(this.dataset);
        alert('Email Sent successfully');
        this.dataset.age = 0;
        this.dataset.name = '';
        this.dataset.country = '';
        this.dataset.email = '';
      });
  }

  ngOnInit(): void {
  }

}
interface Details{
  name:string;
  age:number;
  country:string;
  email:string;
}
