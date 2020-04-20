import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { ActivityService } from '../_services/activity.service';
import { Activity } from '../_models/activity';

@Injectable()
export class ActivityEditResolver implements Resolve<Activity> {

    constructor(private activityService: ActivityService, private authService: AuthService,
                private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Activity> {
        const activityId = route.params['id'];
        if (activityId) {
            return this.activityService.getActivity(activityId).pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving your data');
                    this.router.navigate(['/activities']);
                    return of(null);
                })
            );
        }
        return null;
    }
}
