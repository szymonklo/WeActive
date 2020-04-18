import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes-guard';
import { ListResolver } from './_resolvers/list.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { ActivityListResolver } from './_resolvers/activity-list.resolver';
import { ActivityListComponent } from './activities/activity-list/activity-list.component';
import { ActivityEditComponent } from './activities/activity-edit/activity-edit.component';
import { ActivityEditResolver } from './_resolvers/activity-edit.resolver';
import { ParticipantListComponent } from './participants/participant-list/participant-list.component';
import { ParticipantListResolver } from './_resolvers/participant-list.resolver';
import { ActivityDetailComponent } from './activities/activity-detail/activity-detail.component';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'activity/:id/detail', component: ActivityDetailComponent,
                resolve: {activity: ActivityEditResolver}},
            { path: 'activity/:id/edit', component: ActivityEditComponent,
                resolve: {activity: ActivityEditResolver}},
            { path: 'activity/:id/participants', component: ParticipantListComponent,
                resolve: {participants: ParticipantListResolver}},
            { path: 'activities/:id', component: ActivityListComponent,
                resolve: {activities: ActivityListResolver}},
            { path: 'activities', component: ActivityListComponent,
                resolve: {activities: ActivityListResolver}},
            { path: 'activity/edit', component: ActivityEditComponent,
                resolve: {activity: ActivityEditResolver}},
            { path: 'members', component: MemberListComponent,
                resolve: {users: MemberListResolver}},
            { path: 'members/:id', component: MemberDetailComponent,
                resolve: {user: MemberDetailResolver}},
            { path: 'member/edit', component: MemberEditComponent,
                resolve: {user: MemberEditResolver},
                canDeactivate: [PreventUnsavedChanges]},
            { path: 'messages', component: MessagesComponent,
                resolve: {messages: MessagesResolver}},
            { path: 'lists', component: ListsComponent,
                resolve: {users: ListResolver}}
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full'},
];
