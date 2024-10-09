import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { BlogPost } from '../interfaces/blog-post.interface';
import { onAuthStateChanged } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  firestore = inject(Firestore);
  firebaseAuth = inject(Auth);

  isEditing = new BehaviorSubject<boolean>(false);
  isEditing$ = this.isEditing.asObservable();

  async addPost(title: string, description: string): Promise<void> {
    const uid = this.firebaseAuth.currentUser?.uid;

    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const post = { title: title, description: description, comments: [] };
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
      this.isEditing.next(false);
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userDocRef, {
        posts: arrayRemove(post),
      });
      const updatedPost = {
        ...post,
        title: editTitle,
        description: editDescription,
      };
      await updateDoc(userDocRef, {
        posts: arrayUnion(updatedPost),
      });
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
      onAuthStateChanged(this.firebaseAuth, async (user) => {});
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
