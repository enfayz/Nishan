module.exports = {
  title: '@nishans/notion-formula',
  tagline: 'A package to convert string into notion formula and vice versa',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',
  organizationName: 'Nishan',
  projectName: '@nishans/notion-formula',
  themeConfig: {
    hideableSidebar: true,
    navbar: {
      title: 'Notion Formula',
      logo: {
        alt: 'notion-formula logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'docs/theory/',
          activeBasePath: 'docs',
          label: 'Theory',
          position: 'left',
        },
        {
          to: 'docs/examples/',
          activeBasePath: 'docs',
          label: 'Examples',
          position: 'left',
        },
        {
          href: 'https://github.com/Devorein/Nishan/blob/master/packages/notion-formula/README.md',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/@nishans/notion-formula',
          label: 'NPM',
          position: 'right',
        },
        {
          position: 'right',
          label: 'Discord',
          href: 'https://discord.gg/SpwHCz8ysx',
        },
        {
          label: 'Discussions',
          href: 'https://github.com/Devorein/Nishan/discussions',
          position: 'right',
        },
      ],
    },
    footer: {
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/Devorein/Nishan/edit/master/packages/notion-formula/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        // TypeDoc options
        entryPoints: ['../src/index.ts'],
        tsconfig: '../tsconfig.json',
        plugin: [],

        // Plugin options
        docsRoot: 'docs',
        out: 'api',
        sidebar: {
          sidebarFile: 'notion-formula.js',
          fullNames: true,
          readmeLabel: 'Overview'
        },
      },
    ],
  ],
};
