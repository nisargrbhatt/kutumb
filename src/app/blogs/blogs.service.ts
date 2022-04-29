import { Injectable } from '@angular/core';
import {
  addDoc,
  arrayRemove,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  setDoc,
  updateDoc,
  arrayUnion,
  where,
  query,
  docData,
  limit,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Blog, BlogComment } from '../interfaces/blog';

@Injectable({
  providedIn: 'root',
})
export class BlogsService {
  blogs$: Observable<Blog[]>;
  blogsCollectionRef: CollectionReference<Blog | any>;

  constructor(private afs: Firestore) {
    this.blogsCollectionRef = collection(this.afs, 'blogs');
    this.blogs$ = collectionData<Blog | any>(this.blogsCollectionRef, {
      idField: 'id',
    });
  }

  addBlog(blog: Blog): Promise<DocumentReference<Blog>> {
    return addDoc<Blog>(this.blogsCollectionRef, blog);
  }

  updateBlog(blogData: any, id: string): Promise<void> {
    return setDoc<Blog | any>(doc(this.afs, `blogs/${id}`), blogData, {
      merge: true,
    });
  }

  publishBlog(id: string): Promise<void> {
    return setDoc<Blog | any>(
      doc(this.afs, `blogs/${id}`),
      {
        published: true,
        publishedAt: new Date().toJSON(),
      },
      {
        merge: true,
      }
    );
  }

  deleteBlog(id: string): Promise<void> {
    return deleteDoc(doc(this.afs, `blogs/${id}`));
  }

  addLikes(userId: string, id: string): Promise<any> {
    return updateDoc(doc(this.afs, `blogs/${id}`), {
      likes: arrayUnion(userId),
    });
  }

  deleteLikes(userId: string, id: string): Promise<any> {
    return updateDoc(doc(this.afs, `blogs/${id}`), {
      likes: arrayRemove(userId),
    });
  }

  addBlogComment(comment: BlogComment, id: string): Promise<any> {
    return updateDoc(doc(this.afs, `blogs/${id}`), {
      comments: arrayUnion(comment),
    });
  }

  deleteBlogComment(comment: BlogComment, id: string): Promise<any> {
    return updateDoc(doc(this.afs, `blogs/${id}`), {
      comments: arrayRemove(comment),
    });
  }

  getUsersBlog(userId: string): Observable<Blog[]> {
    const blogQuery = query(
      this.blogsCollectionRef,
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return collectionData<Blog>(blogQuery, {
      idField: 'id',
    });
  }

  getBlogs(): Observable<Blog[]> {
    const blogQuery = query(
      this.blogsCollectionRef,
      where('published', '==', true),
      orderBy('publishedAt', 'desc')
    );

    return collectionData<Blog>(blogQuery, {
      idField: 'id',
    });
  }

  getBlogsFromTags(tags: string[]): Observable<Blog[]> {
    const blogQuery = query(
      this.blogsCollectionRef,
      where('tags', 'array-contains-any', tags),
      orderBy('publishedAt', 'desc')
    );

    return collectionData<Blog>(blogQuery, {
      idField: 'id',
    });
  }

  getBlog(id: string): Observable<Blog | any> {
    return docData<Blog | any>(doc(this.afs, `blogs/${id}`), {
      idField: 'id',
    });
  }

  getBlogFromSlug(slug: string): Observable<Blog[]> {
    const blogQuery = query(
      this.blogsCollectionRef,
      where('slug', '==', slug),
      limit(1)
    );

    return collectionData<Blog>(blogQuery, {
      idField: 'id',
    });
  }
}
