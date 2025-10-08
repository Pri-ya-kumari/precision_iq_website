import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private firestore: AngularFirestore,  private afAuth: AngularFireAuth,
  private router: Router) {
    this.blogForm = this.fb.group({
      heading: [''],
      description: [''],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadBlogs();
  }

  createdAt: Date | null = null;

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (!file || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      alert('Only .png, .jpg and .webp files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      this.blogForm.patchValue({ image: this.imageURL });
    };
    reader.readAsDataURL(file);
  }

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
goToBlogDetail(id: string) {
  if (!id) {
    console.error('Blog ID is undefined');
    Swal.fire('Error', 'Blog not found', 'error');
    return;
  }
  
  console.log('Navigating to blog detail with ID:', id);
  this.router.navigate(['/NewsDetails', id]);
}

editMode: boolean = false;
editBlogId: string | null = null;

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
toggleHideBlog(blog: any) {
  const newHiddenState = !blog.isHidden;

  this.firestore.collection('blogs').doc(blog.id).update({ isHidden: newHiddenState }).then(() => {
    Swal.fire(
      newHiddenState ? 'Hidden!' : 'Visible!',
      `The blog is now ${newHiddenState ? 'hidden' : 'visible'}.`,
      'success'
    );

    // UI me turant reflect kare
    const index = this.blogs.findIndex(b => b.id === blog.id);
    if (index > -1) {
      this.blogs[index].isHidden = newHiddenState;
    }
  });
}




submitBlog() {
  const formValue = this.blogForm.value;
  formValue.createdAt = new Date();
  formValue.isHidden = false; // ✅ by default hidden false

  if (this.editMode && this.editBlogId) {
    // Update blog
    this.firestore.collection('blogs').doc(this.editBlogId).update(formValue).then(() => {
      Swal.fire('Updated!', 'The blog has been updated.', 'success');
      this.resetForm();
    });
  } else {
    // Add new blog
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
      this.router.navigate(['/home']); // or your login/home route
    });
  }

  getTruncatedDescription(description: string): string {
    const plainText = description.replace(/<[^>]+>/g, ''); // remove HTML tags
    const words = plainText.split(/\s+/); // split by space
    const limitedWords = words.slice(0, 40).join(' '); // first 100 words

    return words.length > 40
      ? limitedWords + '...'
      : plainText;
  }
loadBlogs() {
  this.firestore.collection('blogs').snapshotChanges().subscribe(res => {
    this.blogs = res.map(doc => {
      const data = doc.payload.doc.data() as any;
      const id = doc.payload.doc.id;
      return { id, ...data };
    });
    
    // Optional: Sort manually in memory
    this.blogs.sort((a, b) => b.createdAt - a.createdAt);
  });
}



}
