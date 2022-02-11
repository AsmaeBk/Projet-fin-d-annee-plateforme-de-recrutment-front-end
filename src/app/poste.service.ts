import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Poste} from "./poste";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PosteService {

  private apiServerUrl=environment.apiUrl;
  constructor(private http: HttpClient) { }
  public getPostes():Observable<Poste[]>
  {
    return this.http.get<Poste[]>(`${this.apiServerUrl}/poste/all`);
  }
  public addPoste(poste:Poste):Observable<Poste>
  {
    return this.http.post<Poste>(`${this.apiServerUrl}/poste/add`,poste);
  }
  public updatePoste(poste:Poste):Observable<Poste>
  {
    return this.http.put<Poste>(`${this.apiServerUrl}/poste/update`,poste);
  }
  public deletePoste(posteId:number):Observable<void>
  {
    return this.http.delete<void>(`${this.apiServerUrl}/poste/delete/${posteId}`);
  }
}
