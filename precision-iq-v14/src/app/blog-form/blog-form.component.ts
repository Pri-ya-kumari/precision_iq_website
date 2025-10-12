import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  imageURL: string = '';
  blogs: any[] = [];
  editMode: boolean = false;
  editBlogId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    // ✅ Add Validators for required fields
    this.blogForm = this.fb.group({
      heading: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBlogs();
  }

  // Upload image handler
  uploadImage(event: any) {
    const file = event.target.files[0];
    if (!file || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      Swal.fire('Invalid File', 'Only .png, .jpg, and .webp files are allowed', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      this.blogForm.patchValue({ image: this.imageURL });
    };
    reader.readAsDataURL(file);
  }

  // Drag & drop image handlers
  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const inputEvent = { target: { files: [file] } };
      this.uploadImage(inputEvent);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  removeImage() {
    this.imageURL = '';
    this.blogForm.patchValue({ image: '' });
  }

  // Navigation to blog detail
  goToBlogDetail(id: string) {
    if (!id) {
      Swal.fire('Error', 'Blog not found', 'error');
      return;
    }
    this.router.navigate(['/news-details', id]);
  }

  // Edit existing blog
  editBlog(blog: any) {
    this.blogForm.patchValue({
      heading: blog.heading,
      description: blog.description,
      image: blog.image
    });
    this.imageURL = blog.image || '';
    this.editMode = true;
    this.editBlogId = blog.id;
  }

  // Delete blog
  deleteBlog(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the blog permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.firestore.collection('blogs').doc(id).delete();
        Swal.fire('Deleted!', 'The blog has been deleted.', 'success');
      }
    });
  }

  // Hide/Unhide
  toggleHideBlog(blog: any) {
    const newHiddenState = !blog.isHidden;

    this.firestore.collection('blogs').doc(blog.id).update({ isHidden: newHiddenState }).then(() => {
      Swal.fire(
        newHiddenState ? 'Hidden!' : 'Visible!',
        `The blog is now ${newHiddenState ? 'hidden' : 'visible'}.`,
        'success'
      );

      const index = this.blogs.findIndex(b => b.id === blog.id);
      if (index > -1) {
        this.blogs[index].isHidden = newHiddenState;
      }
    });
  }

  // Submit form
  submitBlog() {
    if (this.blogForm.invalid) {
      Swal.fire('Missing Fields', 'Please fill all required fields and upload an image.', 'warning');
      this.blogForm.markAllAsTouched();
      return;
    }

    const formValue = this.blogForm.value;
    formValue.createdAt = new Date();
    formValue.isHidden = false;

    if (this.editMode && this.editBlogId) {
      this.firestore.collection('blogs').doc(this.editBlogId).update(formValue).then(() => {
        Swal.fire('Updated!', 'The blog has been updated successfully.', 'success');
        this.resetForm();
      });
    } else {
      this.firestore.collection('blogs').add(formValue).then((docRef: any) => {
        this.firestore.collection('blogs').doc(docRef.id).update({ id: docRef.id });
        Swal.fire('Success!', 'Your hospital news section has been created.', 'success');
        this.resetForm();
      });
    }
  }

  resetForm() {
    this.blogForm.reset();
    this.imageURL = '';
    this.editMode = false;
    this.editBlogId = null;
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/home']);
    });
  }

  getTruncatedDescription(description: string): string {
    const plainText = description.replace(/<[^>]+>/g, '');
    const words = plainText.split(/\s+/);
    const limitedWords = words.slice(0, 40).join(' ');
    return words.length > 40 ? limitedWords + '...' : plainText;
  }

  loadBlogs() {
    this.firestore.collection('blogs').snapshotChanges().subscribe(res => {
      this.blogs = res.map(doc => {
        const data = doc.payload.doc.data() as any;
        const id = doc.payload.doc.id;
        return { id, ...data };
      });
      this.blogs.sort((a, b) => b.createdAt - a.createdAt);
    });
  }
}
