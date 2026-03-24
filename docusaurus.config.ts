import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Signal',
  tagline: 'Master the art of interviewing — for interviewers and candidates',
  favicon: 'img/favicon_radio_tower_1A_white.ico',

  url: 'https://signal-workshop.vercel.app',
  baseUrl: '/',

  organizationName: 'geseib',
  projectName: 'Signal',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/geseib/Signal/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/signal-social-card.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Signal',
      logo: {
        alt: 'Signal Logo',
        src: 'img/radio_tower_1A_black.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'workshop101',
          position: 'left',
          label: '101 — Foundations',
        },
        {
          type: 'docSidebar',
          sidebarId: 'workshop201',
          position: 'left',
          label: '201 — Principles',
        },
        {
          type: 'docSidebar',
          sidebarId: 'workshop301',
          position: 'left',
          label: '301 — Advanced',
        },
        {
          type: 'docSidebar',
          sidebarId: 'resources',
          position: 'left',
          label: 'Question Bank',
        },
        {
          to: '/progress',
          label: 'My Progress',
          position: 'right',
        },
        {
          href: 'https://github.com/geseib/Signal',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Workshops',
          items: [
            {label: '101 — Foundations & STAR', to: '/docs/workshop-101/'},
            {label: '201 — Principles & Skills', to: '/docs/workshop-201/'},
            {label: '301 — Advanced', to: '/docs/workshop-301/'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'GitHub', href: 'https://github.com/geseib/Signal'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Signal Interview Workshop. Built by George Seib.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
