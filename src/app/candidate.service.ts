import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Candidate} from "./candidate";

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private baseURL="http://localhost:8087/api/v1/candidates";
  constructor(private httpClient: HttpClient) { }
  getCandidatesList():Observable<Candidate[]>
  {
    return this.httpClient.get<Candidate[]>(`${this.baseURL}`);
  }
  createCandidate(candidate: Candidate):Observable<Object>
  {
return this.httpClient.post(`${this.baseURL}`,candidate);
  }
  getCandidateById(id:number):Observable<Candidate>
  {
    return  this.httpClient.get<Candidate>(`${this.baseURL}/${id}`);
  }
  updateCandidate(id:number,candidate:Candidate):Observable<Object>
  {
return this.httpClient.put(`${this.baseURL}/${id}`,candidate);
  }
  deleteCandidate(id: number):Observable<Object>
  {
return this.httpClient.delete(`${this.baseURL}/${id}`);
  }
}
