/**
 * Site metadata, owner details, experience and skills.
 * Facts come from BRIEF.md only.
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
  /** Shown in the hero's whoami panel. */
  whoami: {
    role: 'Cloud & DevOps Engineer',
    based: 'Lagos, Nigeria',
    remote: 'yes',
    heading: 'SRE / infrastructure',
    stack: ['aws', 'terraform', 'docker', 'github-actions', 'prometheus'],
    status: 'open to junior cloud, DevOps & SRE roles',
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
  { label: 'Résumé', href: 'resume.pdf' },
] as const;

export interface Role {
  title: string;
  org: string;
  /** Human-readable, e.g. "Jan 2026 – Oct 2026". */
  dates: string;
  /** ISO start month, for <time datetime>. */
  start: string;
  end: string;
  points: string[];
}

export const experience: Role[] = [
  {
    title: 'Software & IT Support Associate (NYSC)',
    org: 'Lagos State Internal Revenue Service, Ikeja',
    dates: 'Jan 2026 – Oct 2026',
    start: '2026-01',
    end: '2026-10',
    points: [
      'Implemented security features on self-service portals in line with ISO/IEC 27001, including mandatory privacy-policy acceptance and an enforced 12-character password policy, bringing password compliance to 100% of users.',
      'Designed and built the tax document preparation application.',
      'Supported 50+ users, resolving 90% of system, network, and hardware issues, and reduced recurring network issues by about 30%.',
    ],
  },
  {
    title: 'Cloud / DevOps Engineering Intern',
    org: 'Bloomy Technologies · remote/hybrid',
    dates: 'Aug 2025 – Jan 2026',
    start: '2025-08',
    end: '2026-01',
    points: [
      'Provisioned AWS infrastructure (EC2, S3, IAM, VPC, RDS) with Terraform, using remote state in S3 with DynamoDB locking.',
      'Built and maintained CI/CD pipelines in GitHub Actions and Jenkins covering builds, validation gates, deployments, and rollbacks.',
      'Set up CloudWatch dashboards and alerts, investigated incidents, and documented root causes and procedures.',
    ],
  },
  {
    title: 'IT Support & Software Engineering Intern',
    org: 'Digital Bridge Institute',
    dates: 'Jan 2024 – Jun 2024',
    start: '2024-01',
    end: '2024-06',
    points: [
      'Administered and troubleshot Linux servers and networks, including routing and VLAN issues.',
      'Automated recurring fixes with Bash scripts and wrote reusable runbooks.',
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'cloud (aws)',
    items: ['EC2', 'S3', 'RDS', 'IAM', 'VPC', 'CloudWatch', 'CloudFormation'],
  },
  {
    group: 'infrastructure as code',
    items: ['Terraform', 'S3 + DynamoDB remote state', 'CloudFormation', 'Ansible'],
  },
  {
    group: 'ci/cd',
    items: ['GitHub Actions', 'Jenkins', 'Git', 'test-gated deployments', 'rollbacks'],
  },
  { group: 'containers', items: ['Docker', 'Docker Compose', 'Kubernetes', 'Nginx'] },
  { group: 'observability', items: ['CloudWatch', 'Prometheus', 'Grafana', 'Winston'] },
  {
    group: 'linux & networking',
    items: ['Ubuntu', 'Red Hat', 'DNS', 'routing', 'VLANs', 'HTTP'],
  },
  {
    group: 'languages & data',
    items: ['Python', 'Bash', 'JavaScript (Node.js)', 'PostgreSQL', 'MySQL', 'Redis'],
  },
];

/**
 * Quality gates shown in the colophon teaser, in pipeline order.
 * TODO(phase 3): these are planned; switch the teaser copy to present tense once the workflows exist.
 */
export const pipelineGates = [
  'lint',
  'astro check',
  'build',
  'links',
  'html',
  'lighthouse ≥ 95',
  'axe',
] as const;
