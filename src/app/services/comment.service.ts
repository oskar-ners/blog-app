import { inject, Injectable } from '@angular/core';
import { BlogPost } from '../interfaces/blog-post.interface';
import { Comment } from '../interfaces/comment.interface';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  firestore = inject(Firestore);

  async addComment(
    postId: string,
    newComment: Comment,
    posts: BlogPost[],
    authorUid: string
  ): Promise<void> {
    const post = posts.find((post) => post.id === postId);
    if (!post) return;

    // Dodanie nowego komentarza do lokalnej kopii komentarzy
    post.comments.push(newComment);

    const postDocRef = doc(this.firestore, `users/${authorUid}`);
    const postDoc = await getDoc(postDocRef);

    const existingPosts = postDoc.data()?.['posts'] || [];

    const updatedPosts = existingPosts.map((existingPost: BlogPost) => {
      if (existingPost.id === postId) {
        return {
          ...existingPost,
          comments: [...existingPost.comments, newComment],
        };
      }
      return existingPost;
    });

    await updateDoc(postDocRef, {
      posts: updatedPosts,
    });
  }

  async getComments(): Promise<Comment[]> {
    return [];
  }
}
