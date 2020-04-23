import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { ActivityService } from 'src/app/_services/activity.service';
import {Activity, Status, } from '../../_models/activity';


@Component({
  selector: 'app-activity-edit',
  templateUrl: './activity-edit.component.html',
  styleUrls: ['./activity-edit.component.css']
})
export class ActivityEditComponent implements OnInit {
  // @ViewChild('editForm', {static: true}) editForm: NgForm;
  user: User;
  activity: Activity;
  form: FormGroup;
  activityId: number;

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
    this.createAcvitityEditForm();
    if (this.activity != null) {
      this.activityId = this.activity?.id;
      this.form.patchValue(this.activity);
    }
  }

  submit() {
    if (this.form.getRawValue().id != null) {
      this.activity = Object.assign(this.activity, this.form.value);
    } else {
      this.activity = Object.assign({}, this.form.value);
    }
    this.activity = Object.assign(this.activity, this.form.value);
    // this.activity = Object.assign({}, this.form.value);
    this.activity.id = this.activityId;
    console.log(this.activity);
    this.activity.status = Status.Confirmed;
    console.log(Status.Confirmed);
    console.log(Status.Planned);
    this.activity.status = Status.Planned;
    console.log(this.activity);
    // this.activity.hostId = this.user.id;
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.activity.hostPhotoUrl = photoUrl);
    this.activity.hostUsername = this.authService.currentUser.username;

    console.log(this.activity);

    if (this.form.getRawValue().id != null) {
      this.updateActivity();
    } else {
      this.createActivity();
    }
  }

  cancel() {
    this.form.reset(this.activity);
  }

  createActivity() {
    this.activityService.createActivity(this.activity)
    .subscribe(next => {
      this.alertify.success('Activity created succesfully');
      this.form.reset(this.activity);
    }, error => {
      this.alertify.error(error);
    });
  }

  updateActivity() {
    this.activityService.updateActivity(this.activity.id, this.activity).subscribe(next => {
      this.alertify.success('Activity udated succesfully');
      this.form.reset(this.activity);
    }, error => {
      this.alertify.error(error);
    });
  }

  createAcvitityEditForm() {
    this.form = this.fb.group({
      id: [{value: null, disabled: true}],
      name: ['', Validators.required],

      privateActivity: [false, Validators.required],

      place: ['', Validators.required],

      startDate: ['', Validators.required],
      flexStartDate: [false, Validators.required],
      endDate: ['', Validators.required],
      flexEndDate: [false, Validators.required],

      activityType: [''], // check why patchValue not working, check why unable to create undefined

      description: [''],

      minParticipantsNumber: ['', Validators.required],
      maxParticipantsNumber: ['', Validators.required],

    });
  }
}
