import { Component, OnInit, Input } from '@angular/core';
import { Comment } from 'src/app/_models/comment';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/operators';
import { ActivityService } from 'src/app/_services/activity.service';

@Component({
  selector: 'app-activity-comments',
  templateUrl: './activity-comments.component.html',
  styleUrls: ['./activity-comments.component.css']
})
export class ActivityCommentsComponent implements OnInit {
  @Input() activityId: number;
  // comments: Comment[];
  comments: any;
  newComment: any = {};
  userId: number;

  constructor(private userService: UserService, private authService: AuthService,
              private activityService: ActivityService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.userId = +this.authService.decodedToken.nameid;  // + to convert to number
    this.loadComments();
    this.newComment.content = '';

  }

  loadComments() {
    this.activityService.getComments(this.activityId)
      // .pipe(
      //   tap(comments => {
      //     for (let i = 0; i < comments.length; i++) {
      //       if (messages[i].isRead === false && messages[i].recipientId === this.currentUserId) {
      //         this.userService.markAsRead(this.currentUserId, messages[i].id);
      //       }
      //     }
      //   })
      // )
      .subscribe((comments) => {
        this.comments = comments;
      }, error => {
        this.alertify.error(error);
      });
  }

  postComment(parentComment?) {
    this.newComment.activityId = this.activityId;
    this.newComment.parentId = parentComment?.id;
    this.activityService.postComment(this.userId, this.newComment)
      .subscribe((comment: Comment) => {
        // debugger;
        if (parentComment === undefined) {
          this.comments.unshift(comment);
        } else {
          if (parentComment.replies) {
            parentComment.replies.unshift(comment);
          } else {
            parentComment.replies = comment;
          }
          parentComment.toReply = false;
        }
        this.newComment.content = '';
    }, error => {
      this.alertify.error(error);
    });
  }

  toReply(comment) {
    comment.toReply = true;
  }

}
