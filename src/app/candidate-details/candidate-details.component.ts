import { Component, OnInit } from '@angular/core';
import {Candidate} from "../candidate";
import {ActivatedRoute} from "@angular/router";
import {CandidateService} from "../candidate.service";

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {

  id!:number;
  candidate!:Candidate;
  constructor(private route:ActivatedRoute,
              private candidateService:CandidateService
              ) { }

  ngOnInit(): void {

    this.id=this.route.snapshot.params['id'];
    this.candidate=new Candidate();
    this.candidateService.getCandidateById(this.id).subscribe(
     data=>
     {
       this.candidate=data;
     }
    );
  }

}
