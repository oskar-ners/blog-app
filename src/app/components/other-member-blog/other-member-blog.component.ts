import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../interfaces/blog-post.interface';
import { DatePipe } from '@angular/common';
import { CommunityService } from '../../services/community.service';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../interfaces/comment.interface';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-other-member-blog',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './other-member-blog.component.html',
  styleUrl: './other-member-blog.component.scss',
})
export class OtherMemberBlogComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  communityService = inject(CommunityService);
  commentService = inject(CommentService);
  firestore = inject(Firestore);
  auth = inject(Auth);

  blogAuthorUsername!: string;
  blogAuthorUid!: string;
  blogAuthorPosts: BlogPost[] = [];
  newComment: string = '';

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe((params) => {
      this.blogAuthorUsername = params['username'];
      this.blogAuthorUid = params['uid'];
    });
    this.blogAuthorPosts = await this.communityService.getAuthorBlogPosts(
      this.blogAuthorUid
    );
  }

  async addComment(postId: string): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userDoc = await getDoc(userDocRef);
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      text: this.newComment,
      createdAt: Timestamp.now(),
      photoURL: userDoc.data()?.['photoURL'],
    };
    await this.commentService.addComment(
      postId,
      newComment,
      this.blogAuthorPosts,
      this.blogAuthorUid
    );
    this.newComment = '';
  }
}
