import { Component, OnInit } from '@angular/core';
import {Candidate} from "../candidate";
import {CandidateService} from "../candidate.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.component.html',
  styleUrls: ['./create-candidate.component.css']
})
export class CreateCandidateComponent implements OnInit {
candidate:Candidate = new Candidate();


  constructor(private candidateService:CandidateService,
              private router:Router) { }

  ngOnInit(): void {
  }
  saveCandidate()
  {
    this.candidateService.createCandidate(this.candidate).subscribe(
data=>
{
console.log(data);
}
    ,
      error=>console.log(error));
  }
  goToCandidateList()
  {
this.router.navigate(['/user/management/candidates'])
  }
  onSubmit()
  {
console.log(this.candidate);
this.saveCandidate();
  }
}
