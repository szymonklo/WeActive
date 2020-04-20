import { Component, OnInit, Input } from '@angular/core';
import { Activity, ActivityType, Status } from 'src/app/_models/activity';


@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.css']
})
export class ActivityCardComponent implements OnInit {
  @Input() activity: Activity;
  activityType: string;
  activityStatus: string;
  duration: Date;

  constructor() { }

  ngOnInit() {
    this.activityType = ActivityType[this.activity.activityType];
    this.activityStatus = Status[this.activity.status];
  }
}
