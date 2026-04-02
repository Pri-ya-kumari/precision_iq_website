import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-investor-relations',
  templateUrl: './investor-relations.component.html',
  styleUrls: ['./investor-relations.component.css', '../homepage/homepage.component.css']
})
export class InvestorRelationsComponent implements OnInit {
  isNavbarCollapsed = false;

  constructor(
    private router: Router,
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  scrollToSection(sectionId: string): void {
    this.router.navigate(['/'], { fragment: sectionId });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const navbar = this.elRef.nativeElement.querySelector('.navbar-collapse');
    const toggler = this.elRef.nativeElement.querySelector('.navbar-toggler');
    if (navbar && toggler && !navbar.contains(event.target as Node) && !toggler.contains(event.target as Node)) {
      this.isNavbarCollapsed = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth > 992) {
      this.isNavbarCollapsed = false;
    }
  }
}
