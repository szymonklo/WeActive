import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivityService } from '../_services/activity.service';
import { Activity } from '../_models/activity';

@Injectable()
export class ActivityListResolver implements Resolve<Activity[]> {
    pageNumber = 1;
    pageSize = 5;
    activityParams: any = {};

    constructor(private activityService: ActivityService,
                private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Activity[]> {
        let activityType = route.params['id'];
        console.log('resolver type');
        console.log(activityType);
        console.log(this.activityParams);

        if (activityType !== undefined)
        {
            console.log('not undefined');
            this.activityParams.activityType = activityType;
        } else {
            this.activityParams = {};
        }
        console.log(this.activityParams);

        return this.activityService.getActivities(this.pageNumber, this.pageSize, this.activityParams).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
