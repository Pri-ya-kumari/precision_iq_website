import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.css']
})
export class NewsDetailsComponent implements OnInit {
  blog: any = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private location: Location
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    
    if (blogId) {
      this.firestore.collection('blogs').doc(blogId).get().subscribe({
        next: (doc) => {
          if (doc.exists) {
            this.blog = doc.data();
          } else {
            this.error = true;
            console.error('Blog not found with ID:', blogId);
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching blog:', error);
          this.error = true;
          this.loading = false;
        }
      });
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  goBack() {
    this.location.back();
  }
}