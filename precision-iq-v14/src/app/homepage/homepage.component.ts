import { AfterViewInit, Component, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit, OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private router: Router,
    private firestore: AngularFirestore
  ) { }

  // -------------------- SLIDER --------------------
  // Change from private to public for template access
  slideIndex: number = 0;
  private intervalId: any;
  isNavbarCollapsed: boolean = false;
  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
  // Close navbar when clicking outside on mobile
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const navbar = this.elRef.nativeElement.querySelector('.navbar-collapse');
    const toggler = this.elRef.nativeElement.querySelector('.navbar-toggler');

    if (navbar && toggler && !navbar.contains(event.target as Node) && !toggler.contains(event.target as Node)) {
      this.isNavbarCollapsed = false;
    }
  }
  // Close navbar when window is resized to larger screen
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (window.innerWidth > 992) { // Bootstrap lg breakpoint
      this.isNavbarCollapsed = false;
    }
  }

  // -------------------- SERVICE CARDS --------------------
  serviceCards = [
    {
      icon: '🌍',
      title: 'Proven Innovation. Real-World Impact.',
      description: `The PrecizionIQ team has a strong track record of translating research into real-world solutions that span from therapeutics to agbiotech breakthroughs. We're applying this same translational rigor to redefine prenatal diagnostics for a broader, more inclusive future. With strong academic and clinical partnerships, and a deep commitment to equitable healthcare, we are poised to bring precision diagnostics into mainstream prenatal care — making them accessible not just to a few, but to all.`,
      expanded: false,
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'No Parent Should Decide in Uncertainty',
      description: `Too often, families face emotional and clinical turmoil due to late-stage or ambiguous prenatal diagnostic results. We've witnessed the anxiety ourselves, and we believe there's a better way — one where science empowers peace of mind.`,
      expanded: false,
    },
    {
      icon: '🧬',
      title: 'A New Generation of Prenatal Diagnostics',
      description: `Our mission is to deliver diagnostics that are early, non-invasive, affordable, and clinically actionable. We're reimagining how prenatal care is accessed and delivered, leveraging:
      • Cutting-edge metabolomics and small-molecule profiling
      • High-resolution mass spectrometry platforms
      • Proprietary biomarker panels built on validated science.`,
      expanded: false,
    },
    {
      icon: '❤️',
      title: 'Our Story Is Personal',
      description: `But beyond the science, our story is personal. We started PrecizionIQ with a single, powerful conviction.`,
      expanded: false,
    },
  ].map(card => {
    const words = card.description.trim().split(/\s+/);
    return {
      ...card,
      showReadMore: words.length > 30,
      previewLimit: 120
    };
  });

  toggleExpand(index: number): void {
    this.serviceCards[index].expanded = !this.serviceCards[index].expanded;
  }

  // -------------------- BENEFITS --------------------
  benefits = [
    {
      icon: '🕑',
      title: 'Ultra-Early Detection',
      description: 'Detects biomarkers in maternal blood and urine as early as six weeks into gestation—well ahead of conventional methods.',
      expanded: false,
    },
    {
      icon: '🎯',
      title: 'High Accuracy',
      description: 'By mapping disease-specific metabolic fingerprints, our technology delivers >95% accuracy in distinguishing affected from unaffected pregnancies',
      expanded: false,
    },
    {
      icon: '💉',
      title: 'Non-Invasive Testing',
      description: 'A simple blood or urine test—no needles, no procedures, no risk.',
      expanded: false,
    },
    {
      icon: '🌍',
      title: 'Affordability at Scale',
      description: 'Designed with scalability and equity in mind, our tests are priced for widespread use in both urban and rural settings, especially in emerging healthcare systems.',
      expanded: false,
    },
    {
      icon: '🧠 ',
      title: 'AI-Enhanced Biomarker Discovery',
      description: 'Each sample is analyzed across hundreds of thousands of molecular features using machine-assisted data filtering. This enables us to identify a focused panel of highly specific, clinically validated markers.',
      expanded: false,
    }
  ].map(item => {
    const wordCount = item.description.trim().split(/\s+/).length;
    return {
      ...item,
      showReadMore: wordCount > 15
    };
  });

  ngOnInit(): void {
    this.loadNewsFromFirebase();

    // Close navbar on route change
    this.router.events.subscribe(() => {
      this.isNavbarCollapsed = false;
    });

    // Start slider after a brief delay to ensure DOM is ready
    setTimeout(() => {
      this.startSlider();
    }, 100);

    // blog detail if needed
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.firestore.collection('blogs').doc(blogId).get().subscribe(doc => {
        if (doc.exists) {
          this.blog = doc.data();
        }
      });
    }

    // Start slider after a brief delay to ensure DOM is ready
    setTimeout(() => {
      this.startSlider();
    }, 100);
  }

  private startSlider(): void {
    this.showSlide(this.slideIndex);

    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 2000); // Auto slide every 6s
  }

  showSlide(index: number): void {
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.carousel-indicators li');

    if (slides.length === 0) return;

    // Remove active class from all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });

    // Remove active class from all dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });

    this.slideIndex = (index + slides.length) % slides.length;

    // Add active class to current slide and dot
    slides[this.slideIndex].classList.add('active');
    if (dots[this.slideIndex]) {
      dots[this.slideIndex].classList.add('active');
    }
  }

  nextSlide(): void {
    this.showSlide(this.slideIndex + 1);
  }

  prevSlide(): void {
    this.showSlide(this.slideIndex - 1);
  }

  setSlide(index: number): void {
    this.showSlide(index);
  }


  // Clean up interval on component destroy
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // -------------------- SCROLL + LOGIN --------------------
  login() {
    this.router.navigate(['/login']);
  }

  scrollToSection(sectionId: string): void {
    const section = this.elRef.nativeElement.querySelector('#' + sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // -------------------- BLOGS --------------------
  blogs: any[] = [];
  blog: any;

  loadNewsFromFirebase() {
    this.firestore.collection('blogs', ref =>
      ref
        .where('isHidden', '==', false)
    )

      .snapshotChanges()
      .subscribe(data => {
        this.blogs = data.map(item => {
          const blogData = item.payload.doc.data() as { [key: string]: any };
          return {
            id: item.payload.doc.id,
            ...blogData
          };
        });
      });
  }

  goToBlogDetail(id: string) {
    if (!id) {
      console.error('Blog ID is undefined');
      return;
    }
    this.router.navigate(['/NewsDetails', id]);
  }

  // -------------------- ANIMATIONS --------------------
  ngAfterViewInit() {
    // Fade-in animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    // Read More / Read Less (120 words limit)
    const wordLimit = 120;

    document.querySelectorAll('.service-card').forEach(card => {
      const p = card.querySelector('.card-text') as HTMLElement;
      const btn = card.querySelector('.read-more-btn') as HTMLElement;
      if (!p || !btn) return;

      const fullText = p.innerText.trim();
      const words = fullText.split(/\s+/);

      if (words.length > wordLimit) {
        const shortText = words.slice(0, wordLimit).join(' ') + '...';

        p.setAttribute('data-full', fullText);
        p.setAttribute('data-short', shortText);
        p.innerText = shortText;
        btn.style.display = 'inline-block';

        btn.addEventListener('click', () => {
          if (p.innerText === p.getAttribute('data-short')) {
            p.innerText = p.getAttribute('data-full')!;
            btn.innerText = 'Read Less';
          } else {
            p.innerText = p.getAttribute('data-short')!;
            btn.innerText = 'Read More';
          }
        });
      } else {
        btn.style.display = 'none';
      }
    });
  }
}