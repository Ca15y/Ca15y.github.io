/**
 * Open Graph images, generated at build time with Satori (HTML/CSS → SVG) and resvg (SVG → PNG).
 * One 1200×630 card per page, drawn in the site's dark palette and fonts.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
// Satori reads .woff/.ttf but not .woff2, so these come from the static @fontsource packages.
const font = (pkg: string, file: string) => readFileSync(require.resolve(`${pkg}/files/${file}`));

const fonts = [
  { name: 'Inter', data: font('@fontsource/inter', 'inter-latin-400-normal.woff'), weight: 400 },
  { name: 'Inter', data: font('@fontsource/inter', 'inter-latin-600-normal.woff'), weight: 600 },
  {
    name: 'JetBrains Mono',
    data: font('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff'),
    weight: 400,
  },
] as const;

// Dark theme tokens from global.css.
const c = {
  bg: '#0c0e10',
  surface: '#14171a',
  text: '#e7e9ec',
  muted: '#9ba3ad',
  accent: '#f0b450',
  line: '#23282d',
};

export interface OgCard {
  /** Terminal-style label, e.g. "cat jobbr.md". */
  label: string;
  title: string;
  /** Optional line under the title (a summary or the stack). */
  subtitle?: string;
}

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
});

// The card fonts are Latin subsets; map the few symbols the site uses that they don't contain.
const latin = (text: string) => text.replace(/→/g, '->').replace(/←/g, '<-').replace(/≥/g, '>=');

const clamp = (raw: string, max: number) => {
  const text = latin(raw);
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
};

export async function renderOgImage({
  label,
  title,
  subtitle,
}: OgCard): Promise<Uint8Array<ArrayBuffer>> {
  const tree = h(
    'div',
    {
      // Satori sizes the content box, so subtract the padding (80px sides, 72px top and bottom)
      // and the 8px top border to land on exactly 1200×630.
      width: 1040,
      height: 478,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px',
      background: c.bg,
      color: c.text,
      fontFamily: 'Inter',
      borderTop: `8px solid ${c.accent}`,
    },
    h(
      'div',
      { display: 'flex', flexDirection: 'column', width: 1040 },
      h(
        'div',
        { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 30, color: c.accent },
        `$ ${latin(label)}`,
      ),
      h(
        'div',
        {
          display: 'flex',
          width: 1040,
          marginTop: 28,
          fontSize: title.length > 48 ? 58 : 68,
          fontWeight: 600,
          lineHeight: 1.12,
          letterSpacing: -1.5,
        },
        clamp(title, 90),
      ),
      ...(subtitle
        ? [
            h(
              'div',
              {
                display: 'flex',
                width: 1040,
                marginTop: 28,
                fontSize: 30,
                lineHeight: 1.4,
                color: c.muted,
              },
              clamp(subtitle, 150),
            ),
          ]
        : []),
    ),
    h(
      'div',
      {
        display: 'flex',
        width: 1040,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 28,
        borderTop: `2px solid ${c.line}`,
        fontFamily: 'JetBrains Mono',
        fontSize: 26,
        color: c.muted,
      },
      h('div', { display: 'flex' }, h('span', { color: c.accent }, '~/'), 'cally-joseph israel'),
      h('div', { display: 'flex' }, 'Cloud & DevOps Engineer'),
    ),
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: fonts.map((f) => ({ ...f, style: 'normal' as const })),
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Uint8Array(png);
}
