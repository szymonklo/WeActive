import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-miniature',
  templateUrl: './member-miniature.component.html',
  styleUrls: ['./member-miniature.component.css']
})
export class MemberMiniatureComponent implements OnInit {
  @Input() userId: number;
  user: User;


  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.userService.getUser(this.userId)
      .subscribe((user: User) => {
        this.user = user;
      }, error => {
        this.alertify.error(error);
      });
  }

}
