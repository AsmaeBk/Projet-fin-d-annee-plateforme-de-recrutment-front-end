import { Component, OnInit } from '@angular/core';
import {CandidateService} from "../candidate.service";
import {Candidate} from "../candidate";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-update-candidate',
  templateUrl: './update-candidate.component.html',
  styleUrls: ['./update-candidate.component.css']
})
export class UpdateCandidateComponent implements OnInit {
  id!:number;
candidate:Candidate=new Candidate();
  constructor(private candidateService:CandidateService,
              private route:ActivatedRoute,
              private router:Router) { }

  ngOnInit(): void
  {
    this.id=this.route.snapshot.params['id'];

    this.candidateService.getCandidateById(this.id).
    subscribe(
      data =>
      {
        this.candidate=data;
      },
      error => console.log(error)
    );
  }
onSubmit()
{
  this.candidateService.updateCandidate(this.id,this.candidate).subscribe(
    data =>
    {
this.goToCandidateList();
    }
    ,
    error => console.log(error)
  );
}

  goToCandidateList()
  {
    this.router.navigate(['/user/management/candidates'])
  }
}
