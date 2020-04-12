import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { Activity } from 'src/app/_models/activity';
import { ActivityService } from 'src/app/_services/activity.service';


@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  activities: Activity[];
  userParams: any = {};
  pagination: Pagination;



  constructor(private activityService: ActivityService, private alertify: AlertifyService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.activities = data['activities'].result;
      this.pagination = data['activities'].pagination;
    });

    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadActivities();
  }

  resetFilters() {
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.loadActivities();
  }

  loadActivities() {
    this.activityService.getActivities(this.pagination.currentPage, this.pagination.itemsPerPage,
      this.userParams)
      .subscribe((res: PaginatedResult<Activity[]>) => {
      this.activities = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
}
