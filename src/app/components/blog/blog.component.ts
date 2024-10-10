import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../interfaces/blog-post.interface';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    DatePipe,
    LogoutButtonComponent,
    NavComponent,
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  blogService = inject(BlogService);
  firebaseAuth = inject(Auth);

  title: string = '';
  description: string = '';
  editTitle: string = '';
  editDescription: string = '';
  blogPosts: BlogPost[] = [];
  editingPost: BlogPost | null = null;
  imageFile: File | null = null;

  async ngOnInit(): Promise<void> {
    onAuthStateChanged(this.firebaseAuth, async (user) => {
      if (user) {
        this.blogPosts = await this.blogService.getPosts();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.imageFile = input.files[0];
    }
  }

  async addPost(title: string, description: string): Promise<void> {
    if (!title || !description) return;

    let imageUrl: string | null = null;
    if (this.imageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${this.imageFile.name}`);

      await uploadBytes(storageRef, this.imageFile).then(async () => {
        imageUrl = await getDownloadURL(storageRef);
      });
    }

    await this.blogService.addPost(title, description, imageUrl);
    this.blogPosts = await this.blogService.getPosts();
    this.title = '';
    this.description = '';
    this.imageFile = null;
  }

  async removePost(post: BlogPost): Promise<void> {
    this.blogService.deletePost(post);
    this.blogPosts = await this.blogService.getPosts();
  }

  startEditing(post: BlogPost): void {
    this.editingPost = post;
    this.editTitle = post.title;
    this.editDescription = post.description;
  }

  async editPost(): Promise<void> {
    if (!this.editTitle || !this.editDescription || !this.editingPost) return;
    await this.blogService.editPost(
      this.editingPost,
      this.editTitle,
      this.editDescription
    );
    this.blogPosts = await this.blogService.getPosts();
    this.editTitle = '';
    this.editDescription = '';
    this.editingPost = null;
  }

  switchEditMode(): void {
    this.blogService.isEditMode.update((value) => !value);
    this.editingPost = null;
  }
}
