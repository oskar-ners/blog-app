import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../interfaces/blog-post.interface';
import { DatePipe } from '@angular/common';
import { CommunityService } from '../../services/community.service';

@Component({
  selector: 'app-other-member-blog',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './other-member-blog.component.html',
  styleUrl: './other-member-blog.component.scss',
})
export class OtherMemberBlogComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  communityService = inject(CommunityService);

  blogAuthorUsername!: string;
  blogAuthorUid!: string;
  blogAuthorPosts: BlogPost[] = [];

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe((params) => {
      this.blogAuthorUsername = params['username'];
      this.blogAuthorUid = params['uid'];
    });
    this.blogAuthorPosts = await this.communityService.getAuthorBlogPosts(
      this.blogAuthorUid
    );
  }
}
