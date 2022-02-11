import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthenticationService} from "./service/authentication.service";
import {UserService} from "./service/user.service";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {AuthenticationGuard} from "./guard/authentication.guard";
import {NotificationModule} from "./notification.module";
import {NotificationService} from "./service/notification.service";
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { PostHeaderComponent } from './post-header/post-header.component';
import { AddPostComponent } from './add-post/add-post.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import {CKEditorModule} from "ng2-ckeditor";
import {QuillModule} from "ngx-quill";
import { PostComponent } from './post/post.component';
import { HomeComponent } from './home/home.component';
import { PosteComponent } from './poste/poste.component';
import { PostDateComponent } from './post-date/post-date.component';
import { CandidatHomeComponent } from './candidat-home/candidat-home.component';
import { CandidatComponent } from './candidat/candidat.component';

import {ModalDismissReasons, NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CreateCandidateComponent } from './create-candidate/create-candidate.component';
import { UpdateCandidateComponent } from './update-candidate/update-candidate.component';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';
import { NotificationComponent } from './notification/notification.component';
import { MailComponent } from './mail/mail.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RegisterComponent,
    PostHeaderComponent,
    AddPostComponent,
    PostComponent,
    HomeComponent,
    PosteComponent,
    PostDateComponent,
    CandidatHomeComponent,
    CandidatComponent,
    CandidateListComponent,
    CreateCandidateComponent,
    UpdateCandidateComponent,
    CandidateDetailsComponent,
    NotificationComponent,
    MailComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    [CKEditorModule, FormsModule],
    NotificationModule,
    ReactiveFormsModule,
    EditorModule,
    QuillModule,



  ],
  providers: [NotificationService, AuthenticationGuard,AuthenticationService, UserService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})

// @ts-ignore
export class AppModule { }
