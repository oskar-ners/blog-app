import { Injectable } from '@angular/core';
import { BlogPost } from '../interfaces/blog-post.interface';
import { Comment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  addComment(postId: string, newComment: Comment, posts: BlogPost[]) {
    posts = posts.filter((post) => post.id === postId);
    posts[0].comments.push(newComment);
  }
}
