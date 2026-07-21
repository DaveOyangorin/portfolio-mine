/** Skills and years of experience, exactly as listed on the live site. */

import type { Skill, SkillCategory } from './types';

export const skills: Skill[] = [
  { name: 'WordPress', years: 6, category: 'CMS & Builders' },
  { name: 'Elementor', years: 5, category: 'CMS & Builders' },
  { name: 'GohighLevel', years: 3, category: 'CMS & Builders' },

  { name: 'SEO', years: 5, category: 'SEO & Marketing' },
  { name: 'Digital Marketing', years: 2, category: 'SEO & Marketing' },
  { name: 'Google Ads', years: 2, category: 'SEO & Marketing' },

  { name: 'JavaScript', years: 5, category: 'Front-End' },
  { name: 'Vue Js', years: 5, category: 'Front-End' },

  { name: 'Figma', years: 2, category: 'Design & Tools' },
  { name: 'Canva', years: 2, category: 'Design & Tools' },
];

/** Display order for the category columns. */
export const skillCategories: SkillCategory[] = [
  'CMS & Builders',
  'SEO & Marketing',
  'Front-End',
  'Design & Tools',
];

/** Groups skills by category, preserving `skillCategories` order. */
export function skillsByCategory(): { category: SkillCategory; items: Skill[] }[] {
  return skillCategories.map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category),
  }));
}

/** Highest years value, used to scale the proficiency bars. */
export const maxSkillYears = Math.max(...skills.map((skill) => skill.years));
