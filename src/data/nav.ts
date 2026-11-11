/** Primary navigation. Same-page anchors carry a sectionId for the scroll-spy. */

export interface NavItem {
  label: string;
  href: string;
  /** Section id observed by the scroll-spy, for same-page anchors. */
  sectionId?: string;
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/#home', sectionId: 'home' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Expertise', href: '/#services', sectionId: 'services' },
  { label: 'Experience', href: '/#experience', sectionId: 'experience' },
  { label: 'About', href: '/#about', sectionId: 'about' },
  { label: 'Contact', href: '/#contact', sectionId: 'contact' },
];
