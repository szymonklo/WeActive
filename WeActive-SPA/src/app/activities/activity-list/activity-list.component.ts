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
  activityParams: any = {};
  pagination: Pagination;



  constructor(private activityService: ActivityService, private alertify: AlertifyService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.activities = data['activities'].result;
      this.pagination = data['activities'].pagination;
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadActivities();
  }

  resetFilters() {
    this.loadActivities();
  }

  loadActivities() {
    this.activityService.getActivities(this.pagination.currentPage, this.pagination.itemsPerPage,
      this.activityParams)
      .subscribe((res: PaginatedResult<Activity[]>) => {
      this.activities = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
}
