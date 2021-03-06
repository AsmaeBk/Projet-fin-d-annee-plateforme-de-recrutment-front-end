import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {User} from "../model/user";
import {NotificationType} from "../enum/notification-type.enum";
import {HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";
import { Router } from '@angular/router';
import {UserService} from "../service/user.service";
import {AuthenticationService} from "../service/authentication.service";
import {NotificationService} from "../service/notification.service";
import {NgForm} from "@angular/forms";
import {CustomHttpRespone} from "../model/custom-http-response";
import { FileUploadStatus } from '../model/file-upload.status';
import {Role} from "../enum/role.enum";
import { SubSink } from 'subsink';
import {AddPostService} from "../add-post.service";
import {PostPayload} from "../add-post/post-payload";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit,OnDestroy {
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
 public fileStatus = new FileUploadStatus();

  posts!: Observable<Array<PostPayload>>;
  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(true);
    this.posts = this.postService.getAllPosts();
  }
  constructor(private router: Router, private authenticationService: AuthenticationService,
              private userService: UserService, private notificationService: NotificationService,private postService: AddPostService) {
  }
  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }
  public getUsers(showNotification: boolean): void {
   this.refreshing = true;
this.subs.add(

      this.userService.getUsers().subscribe(
        // @ts-ignore
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS,
              `${response.length} user(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );


  }
  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    this.sendNotification(NotificationType.SUCCESS, `You've been successfully logged out`);
  }
  public onUpdateCurrentUser(user: User): void {
    this.refreshing = true;
    this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
    const formData = this.userService.createUserFormDate(this.currentUsername, user, this.profileImage!);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.authenticationService.addUserToLocalCache(response);
          this.getUsers(false);
          // @ts-ignore
          this.fileName = null;
          // @ts-ignore
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
          // @ts-ignore
          this.profileImage = null;
        }
      )
    );
  }
  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user!.username);
    formData.append('profileImage', this.profileImage!);

    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe(
        // @ts-ignore
        (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.fileStatus.status = 'done';
        }
      )
    );
  }
  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total!);
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user!.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.sendNotification(NotificationType.SUCCESS, `${event.body.firstName}\'s profile image updated successfully`);
          this.fileStatus.status = 'done';
          break;
        } else {
          this.sendNotification(NotificationType.ERROR, `Unable to upload image. Please try again`);
          break;
        }
      default:
        `Finished all processes`;
    }
  }
  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    // @ts-ignore
    document.getElementById('openUserInfo').click();
   this.clickButton('openUserInfo');
  }
  // public onProfileImageChange(event: any, file: any): void {
  // console.log(event);}
  public onProfileImageChange(fileName: string, profileImage: File): void {

    this.fileName = fileName;
    this.profileImage = profileImage


    ;
  }
  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
  }

  //  public updateProfileImage(formData: FormData): void {
 // this.clickButton('profile-image-input');
 //  }
  // public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
  //   return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
  //     {
  //       reportProgress: true,
  //       observe: 'events'
  //     });
  // }
  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }
  public onAddNewUser(userForm: NgForm): void {
    // @ts-ignore
    const formData = this.userService.createUserFormDate(null, userForm.value, this.profileImage);

    this.subs.add(
      this.userService.addUser(formData).subscribe(
        // @ts-ignore
        (response: User) => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          // @ts-ignore
          this.fileName = null;
          // @ts-ignore
          this.profileImage = null;
          userForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} added successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          // @ts-ignore
          this.profileImage = null;
        }
      )
    );
  }

  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.currentUsername = editUser.username;
    this.clickButton('openUserEdit');
  }
  public onUpdateUser(): void {
    const formData = this.userService.createUserFormDate
    (this.currentUsername!, this.editUser, this.profileImage!);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          // @ts-ignore
          this.fileName= null;
          // @ts-ignore
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS,
            `${response.firstName} ${response.lastName}
            updated successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR,
            errorResponse.error.message);
          // @ts-ignore
          this.profileImage = null;
        }
      )
    );
  }
  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.refreshing = false;
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.WARNING, error.error.message);
          this.refreshing = false;
        },
        () => emailForm.reset()
      )
    );
  }
  public onDeleteUder(username: string): void {
    this.subscriptions.push(
      this.userService.deleteUser(username!).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getUsers(true);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }
  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
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
  public searchUsers(searchTerm: string): void {
    const results: User[] = [];
    for (const user of this.userService.getUsersFromLocalCache()!) {
      if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        results.push(user);
      }
    }
    this.users = results;
    if (results.length === 0 || !searchTerm) {
      this.users = this.userService.getUsersFromLocalCache()!;
    }
  }
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }
  private clickButton(buttonId: string): void {

    document.getElementById(buttonId)!.click();
  }
ngOnDestroy():void
{
this.subs.unsubscribe();
}
}
