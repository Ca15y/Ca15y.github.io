import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage, type OgCard } from '../../lib/og';
import { owner, pipelineGates } from '../../data/site';

/** One social preview image per page: /og/<slug>.png */
export const getStaticPaths = (async () => {
  const projects = await getCollection('projects');
  const cards: Record<string, OgCard> = {
    home: {
      label: 'whoami',
      title:
        'I build cloud infrastructure that lives in code and ships through pipelines, not by hand.',
      subtitle: `${owner.name} · ${owner.location}`,
    },
    projects: {
      label: 'ls projects/',
      title: 'Projects',
      subtitle: 'Case studies of cloud, DevOps and automation work.',
    },
    colophon: {
      label: 'cat colophon.md',
      title: 'How this site is built',
      subtitle: [...pipelineGates, 'deploy'].join(' · '),
    },
  };
  for (const p of projects) {
    cards[p.id] = {
      label: `cat ${p.id}.md`,
      title: p.data.title,
      subtitle: p.data.stack.join(' · '),
    };
  }
  return Object.entries(cards).map(([slug, card]) => ({ params: { slug }, props: { card } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage((props as { card: OgCard }).card);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
