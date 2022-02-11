import { Component, OnInit } from '@angular/core';
import {Poste} from "../poste";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";
import {PosteService} from "../poste.service";
import { DatePipe } from '@angular/common';
import {NgForm} from "@angular/forms";
import {FileService} from "../service/file.service";
import { saveAs } from 'file-saver';
import {SubSink} from "subsink";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {User} from "../model/user";
import {FileUploadStatus} from "../model/file-upload.status";
import {PostPayload} from "../add-post/post-payload";
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {UserService} from "../service/user.service";
import {NotificationService} from "../service/notification.service";
import {AddPostService} from "../add-post.service";
import {NotificationType} from "../enum/notification-type.enum";
import {CustomHttpRespone} from "../model/custom-http-response";
import {Role} from "../enum/role.enum";
import {Candidat} from "../model/Candidat";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CandidateService} from "../candidate.service";
import {Candidate} from "../candidate";
@Component({
  selector: 'app-poste',
  templateUrl: './poste.component.html',
  styleUrls: ['./poste.component.css']
})
export class PosteComponent implements OnInit {
  candidate:Candidate = new Candidate();
public postes!:Poste[];
public   editPoste!: Poste;
public deletePoste!:Poste;
public userFile:any=File;
  filenames: string[] = [];
  fileStatus = { status: '', requestType: '', percent: 0 };
  private subs = new SubSink();
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public users?: User[];
  public user?: User;
  public refreshing?: boolean;
  public selectedUser?: User;
  public fileName?: string;
  public profileImage?: File;
  private subscriptions: Subscription[] = [];
  public editUser = new User();
  private currentUsername?: string;
 // public fileStatus = new FileUploadStatus();
  posts!: Observable<Array<PostPayload>>;


  candidats!:Candidat[];
  closeResult!:string;
  constructor(private posteService:PosteService,
              private fileService: FileService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private notificationService: NotificationService,
              private postService: AddPostService,
              private modalService:NgbModal,
              private  httpClient:HttpClient,
              private candidateService:CandidateService
  ) { }
  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }
  candidateDetails(id:number)
  {
    this.router.navigate(['user/management/candidate-details',id]);
  }
  saveCandidate()
  {
    this.candidateService.createCandidate(this.candidate).subscribe(
      data=>
      {
        console.log(data);
       // this.goToCandidateList();
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
  // onSubmit(f: NgForm) {
  //
  //
  //   const url = 'http://localhost:8087/candidats/addnew';
  //   this.httpClient.post(url, f.value)
  //     .subscribe((result) => {
  //       this.ngOnInit(); //reload the table
  //     });
  //   this.modalService.dismissAll(); //dismiss the modal
  // }
  // @ts-ignore
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  onSelectFile(event:Event)
  {
// @ts-ignore
    const file = (<HTMLInputElement>event.target).files[0];
this.userFile=file;
  }
  // Function to upload files
  onUploadFiles(files: File[]): void {
    const formData = new FormData();
    for (const file of files) { formData.append('files', file, file.name); }

    this.fileService.upload(formData).subscribe(
      event => {
        console.log(event);
        this.resportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }
  // public is=false;
  // define a function to download files
  onDownloadFile(filename: string): void {
    this.fileService.download(filename).subscribe(
      event => {
        console.log(event);
        this.resportProgress(event);
        // this.is=true;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
    // this.is=true;
  }
  private resportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch(httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading... ');
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Downloading... ');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          this.fileStatus.status = 'done';
          for (const filename of httpEvent.body) {
            this.filenames.unshift(filename);
          }
        } else {
          saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
            {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}));
          // saveAs(new Blob([httpEvent.body!],
          //   { type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}),
          //    httpEvent.headers.get('File-Name'));
        }
        this.fileStatus.status = 'done';
        break;
      default:
        console.log(httpEvent);
        break;

    }
  }
  private updateStatus(loaded: number, total: number, requestType: string): void {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }
  public getPostes():void{
    this.posteService.getPostes().subscribe(
      (response:Poste[])=>
      {
        this.postes=response;
      },
      (error: HttpErrorResponse) =>
      {
        alert(error.message);
      }
    );
  }

  getCandidats() {
    this.httpClient.get<any>('http://localhost:8087/candidats').subscribe(
      response => {
        console.log(response);
        this.candidats = response;
      }
    );
  }


  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    //this.getUsers(true);
    this.posts = this.postService.getAllPosts();
    this.getPostes();
    this.getCandidats();
  }

  dateString = '1968-11-16T00:00:00'
 newDate = new Date();

  dateLimite = new Date(Date.parse(Date()));

  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  public onAddPoste(addForm:NgForm):void
  {
    document.getElementById('add-poste-form')!.click();
this.posteService.addPoste(addForm.value).subscribe(
  (response:Poste )=>{
    console.log(response);
    this.getPostes();
    addForm.reset();
  },
  (error:HttpErrorResponse )=>{
    alert(error.message);
    addForm.reset();
  }
);
  }
  public onDeletePoste(posteId: number): void
    {

      this.posteService.deletePoste(posteId).subscribe(
        (response:void )=>{
          console.log(response);
          this.getPostes();
        },
        (error:HttpErrorResponse )=>{
          alert(error.message);

        }
      );
  }
  public onUpdatePoste(poste:Poste):void
  {

    this.posteService.updatePoste(poste).subscribe(
      (response:Poste )=>{
        console.log(response);
        this.getPostes();
      },
      (error:HttpErrorResponse )=>{
        alert(error.message);
      }
    );
  }
  public onOpenModal(poste?:Poste | null ,mode?: String ):void
  {
    const container=document.getElementById('main-container');
    const button=document.createElement('button');
    button.type='button';
    button.style.display='none';
    button.setAttribute('data-toggle','modal');
    if(mode=== 'add')
    {
      button.setAttribute('data-target','#addPosteModal');
    }
    if(mode=== 'edit')
    {
      // @ts-ignore
      this.editPoste=poste;
      button.setAttribute('data-target','#updatePosteModal');
    }
    if(mode=== 'delete')
    {
      // @ts-ignore
      this.deletePoste=poste;
      button.setAttribute('data-target','#deletePosteModal');
    }
container!.appendChild(button);
    button.click();
  }
  public searchPostes(key: string):void
  {
const results:Poste[]=[];
for(const poste of this.postes)
{
  if(poste.title.toLowerCase().indexOf(key.toLowerCase())!==-1 || poste.content.toLowerCase().indexOf(key.toLowerCase())!==-1)
  {
    results.push(poste);
  }
}
this.postes=results;

if(results.length===0 || !key)
{
  this.getPostes();
}
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
////////////////////////////////////////////////////////////////////////////////////////////
//
//   public changeTitle(title: string): void {
//     this.titleSubject.next(title);
//   }
//   public getUsers(showNotification: boolean): void {
//     this.refreshing = true;
//     this.subs.add(
//
//       this.userService.getUsers().subscribe(
//         // @ts-ignore
//         (response: User[]) => {
//           this.userService.addUsersToLocalCache(response);
//           this.users = response;
//           this.refreshing = false;
//           if (showNotification) {
//             this.sendNotification(NotificationType.SUCCESS,
//               `${response.length} user(s) loaded successfully.`);
//           }
//         },
//         (errorResponse: HttpErrorResponse) => {
//           this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
//           this.refreshing = false;
//         }
//       )
//     );
//
//
//   }
//   public onLogOut(): void {
//     this.authenticationService.logOut();
//     this.router.navigate(['/login']);
//     this.sendNotification(NotificationType.SUCCESS, `You've been successfully logged out`);
//   }
//   public onUpdateCurrentUser(user: User): void {
//     this.refreshing = true;
//     this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
//     const formData = this.userService.createUserFormDate(this.currentUsername, user, this.profileImage!);
//     this.subscriptions.push(
//       this.userService.updateUser(formData).subscribe(
//         (response: User) => {
//           this.authenticationService.addUserToLocalCache(response);
//           this.getUsers(false);
//           // @ts-ignore
//           this.fileName = null;
//           // @ts-ignore
//           this.profileImage = null;
//           this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
//         },
//         (errorResponse: HttpErrorResponse) => {
//           this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
//           this.refreshing = false;
//           // @ts-ignore
//           this.profileImage = null;
//         }
//       )
//     );
//   }
//   public onUpdateProfileImage(): void {
//     const formData = new FormData();
//     formData.append('username', this.user!.username);
//     formData.append('profileImage', this.profileImage!);
//
//     this.subscriptions.push(
//       this.userService.updateProfileImage(formData).subscribe(
//         // @ts-ignore
//         (event: HttpEvent<any>) => {
//           this.reportUploadProgress(event);
//         },
//         (errorResponse: HttpErrorResponse) => {
//           this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
//           this.fileStatus.status = 'done';
//         }
//       )
//     );
//   }
//   private reportUploadProgress(event: HttpEvent<any>): void {
//     switch (event.type) {
//       case HttpEventType.UploadProgress:
//         this.fileStatus.percent = Math.round(100 * event.loaded / event.total!);
//         this.fileStatus.status = 'progress';
//         break;
//       case HttpEventType.Response:
//         if (event.status === 200) {
//           this.user!.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
//           this.sendNotification(NotificationType.SUCCESS, `${event.body.firstName}\'s profile image updated successfully`);
//           this.fileStatus.status = 'done';
//           break;
//         } else {
//           this.sendNotification(NotificationType.ERROR, `Unable to upload image. Please try again`);
//           break;
//         }
//       default:
//         `Finished all processes`;
//     }
//   }
//   public onSelectUser(selectedUser: User): void {
//     this.selectedUser = selectedUser;
//     // @ts-ignore
//     document.getElementById('openUserInfo').click();
//     this.clickButton('openUserInfo');
//   }
//   // public onProfileImageChange(event: any, file: any): void {
//   // console.log(event);}
//   public onProfileImageChange(fileName: string, profileImage: File): void {
//
//     this.fileName = fileName;
//     this.profileImage = profileImage
//
//
//     ;
//   }
//   public updateProfileImage(): void {
//     this.clickButton('profile-image-input');
//   }
//
//   //  public updateProfileImage(formData: FormData): void {
//   // this.clickButton('profile-image-input');
//   //  }
//   // public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
//   //   return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
//   //     {
//   //       reportProgress: true,
//   //       observe: 'events'
//   //     });
//   // }
//   public saveNewUser(): void {
//     this.clickButton('new-user-save');
//   }
//   public onAddNewUser(userForm: NgForm): void {
//     // @ts-ignore
//     const formData = this.userService.createUserFormDate(null, userForm.value, this.profileImage);
//
//     this.subs.add(
//       this.userService.addUser(formData).subscribe(
//         // @ts-ignore
//         (response: User) => {
//           this.clickButton('new-user-close');
//           this.getUsers(false);
//           // @ts-ignore
//           this.fileName = null;
//           // @ts-ignore
//           this.profileImage = null;
//           userForm.reset();
//           this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} added successfully`);
//         },
//         (errorResponse: HttpErrorResponse) => {
//           this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
//           // @ts-ignore
//           this.profileImage = null;
//         }
//       )
//     );
//   }
//
//   public onEditUser(editUser: User): void {
//     this.editUser = editUser;
//     this.currentUsername = editUser.username;
//     this.clickButton('openUserEdit');
//   }
//   public onUpdateUser(): void {
//     const formData = this.userService.createUserFormDate
//     (this.currentUsername!, this.editUser, this.profileImage!);
//     this.subscriptions.push(
//       this.userService.updateUser(formData).subscribe(
//         (response: User) => {
//           this.clickButton('closeEditUserModalButton');
//           this.getUsers(false);
//           // @ts-ignore
//           this.fileName= null;
//           // @ts-ignore
//           this.profileImage = null;
//           this.sendNotification(NotificationType.SUCCESS,
//             `${response.firstName} ${response.lastName}
//             updated successfully`);
//         },
//         (errorResponse: HttpErrorResponse) => {
//           this.sendNotification(NotificationType.ERROR,
//             errorResponse.error.message);
//           // @ts-ignore
//           this.profileImage = null;
//         }
//       )
//     );
//   }
//   public onResetPassword(emailForm: NgForm): void {
//     this.refreshing = true;
//     const emailAddress = emailForm.value['reset-password-email'];
//     this.subscriptions.push(
//       this.userService.resetPassword(emailAddress).subscribe(
//         (response: CustomHttpRespone) => {
//           this.sendNotification(NotificationType.SUCCESS, response.message);
//           this.refreshing = false;
//         },
//         (error: HttpErrorResponse) => {
//           this.sendNotification(NotificationType.WARNING, error.error.message);
//           this.refreshing = false;
//         },
//         () => emailForm.reset()
//       )
//     );
//   }
//   public onDeleteUder(username: string): void {
//     this.subscriptions.push(
//       this.userService.deleteUser(username!).subscribe(
//         (response: CustomHttpRespone) => {
//           this.sendNotification(NotificationType.SUCCESS, response.message);
//           this.getUsers(true);
//         },
//         (error: HttpErrorResponse) => {
//           this.sendNotification(NotificationType.ERROR, error.error.message);
//         }
//       )
//     );
//   }


//   public searchUsers(searchTerm: string): void {
//     const results: User[] = [];
//     for (const user of this.userService.getUsersFromLocalCache()!) {
//       if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
//         user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
//         user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
//         user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
//         results.push(user);
//       }
//     }
//     this.users = results;
//     if (results.length === 0 || !searchTerm) {
//       this.users = this.userService.getUsersFromLocalCache()!;
//     }
//   }
//   private sendNotification(notificationType: NotificationType, message: string): void {
//     if (message) {
//       this.notificationService.notify(notificationType, message);
//     } else {
//       this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
//     }
//   }
//   private clickButton(buttonId: string): void {
//
//     document.getElementById(buttonId)!.click();
//   }
//   ngOnDestroy():void
//   {
//     this.subs.unsubscribe();
//   }
}



