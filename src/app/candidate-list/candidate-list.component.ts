import { Component, OnInit } from '@angular/core';
import {Candidate} from "../candidate";
import {CandidateService} from "../candidate.service";
import {Router} from "@angular/router";
import {Role} from "../enum/role.enum";
import {AuthenticationService} from "../service/authentication.service";
import {User} from "../model/user";

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit {

  public user?: User;
candidates!:Candidate[];


  constructor(private candidateService:CandidateService,
              private router:Router,
              private authenticationService: AuthenticationService)
  {

  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getCandidates();
  }
  candidateDetails(id:number)
{
this.router.navigate(['user/management/candidate-details',id]);
}

  deleteCandidate(id:number)
{
this.candidateService.deleteCandidate(id).subscribe(
  data =>
  {
    console.log(data);
this.getCandidates();
  }
);
}
  updateCandidate(id:number)
  {
this.router.navigate(['user/management/update-candidate',id]);
  }
private getCandidates()
{
this.candidateService.getCandidatesList().subscribe(
  data =>
  {
this.candidates=data;
  }
);
}
  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }
  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }
  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }
}
