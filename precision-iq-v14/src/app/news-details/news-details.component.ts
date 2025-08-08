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

 blog: any;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private location: Location
  ) {}
goBack() {
  this.location.back();
}
  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.firestore.collection('blogs').doc(blogId).get().subscribe(doc => {
        if (doc.exists) {
          this.blog = doc.data();
        }
      });
    }
  }

}
