import { inject, Injectable, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { BlogPost } from '../interfaces/blog-post.interface';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  firestore = inject(Firestore);
  firebaseAuth = inject(Auth);

  isEditMode = signal<boolean>(false);

  async addPost(
    title: string,
    description: string,
    imageUrl: string | null
  ): Promise<void> {
    const uid = this.firebaseAuth.currentUser?.uid;

    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const post = {
        id: Math.random().toString(36).substr(2, 9),
        title: title,
        description: description,
        imageUrl: imageUrl,
        createdAt: Timestamp.now(),
        comments: [],
      };
      await updateDoc(userDocRef, {
        posts: arrayUnion(post),
      });
    } catch {
      console.warn('Something went wrong when you tried to add a post!');
    }
  }

  async deletePost(post: BlogPost): Promise<void> {
    const uid = this.firebaseAuth.currentUser?.uid;
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userDocRef, {
        posts: arrayRemove(post),
      });
    } catch (error) {
      console.warn(
        'Something went wrong when you tried to delete a post!',
        error
      );
      throw error;
    }
  }

  async editPost(
    post: BlogPost,
    editTitle: string,
    editDescription: string
  ): Promise<void> {
    const uid = this.firebaseAuth.currentUser?.uid;
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userDocRef);
      const posts = userDoc.data()?.['posts'] || [];

      const postIndex = posts.findIndex(
        (p: BlogPost) =>
          p.title === post.title && p.description === post.description
      );

      if (postIndex !== -1) {
        posts[postIndex] = {
          ...posts[postIndex],
          title: editTitle,
          description: editDescription,
        };

        await updateDoc(userDocRef, {
          posts: posts,
        });
      }
    } catch (error) {
      console.warn(
        'Something went wrong when you tried to edit a post!',
        error
      );
      throw error;
    }
  }

  async getPosts(): Promise<BlogPost[]> {
    try {
      const user = this.firebaseAuth.currentUser;
      if (user) {
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        const userDoc = await getDoc(userDocRef);

        const posts = userDoc.data()?.['posts'] || [];
        return posts as BlogPost[];
      } else {
        console.log('No user logged in');
        return [];
      }
    } catch (error) {
      console.warn('Something went wrong when you tried to get posts!', error);
      throw error;
    }
  }
}
