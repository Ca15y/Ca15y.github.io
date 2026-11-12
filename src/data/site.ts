/**
 * Site metadata and owner details.
 * Experience, skills and education are added here in phase 2.
 */
export const owner = {
  name: 'Cally-Joseph Israel',
  title: 'Cloud & DevOps Engineer',
  location: 'Lagos, Nigeria (remote-ready)',
  email: 'israelcally15@gmail.com',
  links: {
    github: 'https://github.com/Ca15y',
    linkedin: 'https://linkedin.com/in/israel-cally15',
  },
} as const;

export const site = {
  title: `${owner.name} · ${owner.title}`,
  description:
    'Cloud & DevOps engineer in Lagos, Nigeria. Infrastructure as code, test-gated CI/CD pipelines, containers, and observability on AWS.',
  lang: 'en',
} as const;

/** Paths are relative to the site base; resolve them with `url()`. */
export const nav = [
  { label: 'Projects', href: 'projects/' },
  { label: 'Labs', href: '#labs' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
  // TODO(israel): add public/resume.pdf — this link 404s until then.
  { label: 'Résumé', href: 'resume.pdf' },
] as const;
