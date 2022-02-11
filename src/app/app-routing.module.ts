import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {UserComponent} from "./user/user.component";
import {RegisterComponent} from "./register/register.component";
import {AuthenticationGuard} from "./guard/authentication.guard";
import {AddPostComponent} from "./add-post/add-post.component";
import {PostComponent} from "./post/post.component";
import {HomeComponent} from "./home/home.component";
import {CandidatHomeComponent} from "./candidat-home/candidat-home.component";
import {CandidatComponent} from "./candidat/candidat.component";
import {CandidateListComponent} from "./candidate-list/candidate-list.component";
import {CreateCandidateComponent} from "./create-candidate/create-candidate.component";
import {UpdateCandidateComponent} from "./update-candidate/update-candidate.component";
import {CandidateDetailsComponent} from "./candidate-details/candidate-details.component";
import {MailComponent} from "./mail/mail.component";
import {NotificationComponent} from "./notification/notification.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'post/:id', component: PostComponent},
  {path:'user/management/create-candidate',component:CreateCandidateComponent}
  ,
  {path: 'user/management',component:UserComponent , canActivate: [AuthenticationGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},

  {path: 'user/management/home', component: HomeComponent},
  {path: 'add-post', component:AddPostComponent},
  {path:'candidat-home',component:CandidatHomeComponent},
  {path:'candidats',component:CandidatComponent},
  {path: 'user/management/candidates',component:CandidateListComponent} ,
  {path: 'user/management/update-candidate/:id',component:UpdateCandidateComponent},
  {path:'user/management/candidate-details/:id',component:CandidateDetailsComponent},
  {path: 'user/management/candidates/mail',component:NotificationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
