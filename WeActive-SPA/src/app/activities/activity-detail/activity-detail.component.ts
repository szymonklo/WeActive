import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';

import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
// import { Activity } from 'src/app/_models/activity';
import { ActivityService } from 'src/app/_services/activity.service';
import {Activity, Status, } from '../../_models/activity';


@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {
  // @ViewChild('editForm', {static: true}) editForm: NgForm;
  // user: User;
  activity: Activity;
  activityId: number;
  activityStatus: string;
  userId: number;

  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //   if (this.editForm.dirty) {
  //     $event.returnValue = true;
  //   }
  // }

  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private fb: FormBuilder,
              private activityService: ActivityService, private authService: AuthService) { }

  ngOnInit() {
    console.log('This route data: ');
    console.log(this.route.data);
    this.route.data.subscribe(data => {
      this.activity = data['activity'];
    });
    this.userId = +this.authService.decodedToken.nameid;
    if (this.activity != null) {
      this.activityId = this.activity?.id;
      this.activityStatus = Status[this.activity.status];

    }
  }

  canEdit() {
    // console.log(typeof(this.activity.hostId));
    // console.log(this.activity.hostId);
    // console.log(typeof(this.userId));
    // console.log(this.userId);
    // console.log(this.activity.hostId == this.userId);

    if (this.activity.hostId === this.userId) {
      return true;
    }

    return false;
  }

  confirm() {
    console.log(Status.Confirmed);
    this.activity.status = Status.Confirmed;
    this.updateActivity();
  }

  cancel() {
    this.activity.status = Status.Cancelled;
    this.updateActivity();
  }

  updateActivity() {
    this.activityService.updateActivity(this.activity.id, this.activity).subscribe(next => {
      this.alertify.success('Activity udated succesfully');
    }, error => {
      this.alertify.error(error);
    });
  }
}
