/** Primary navigation. Hrefs mirror the live site's anchor structure. */

export interface NavItem {
  label: string;
  href: string;
  /** Section id observed by the scroll-spy, for same-page anchors. */
  sectionId?: string;
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/#home', sectionId: 'home' },
  { label: 'About', href: '/#about', sectionId: 'about' },
  { label: 'Skills', href: '/#skills', sectionId: 'skills' },
  { label: 'Services', href: '/#services', sectionId: 'services' },
  { label: 'Experience', href: '/#experience', sectionId: 'experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/#contact', sectionId: 'contact' },
];
