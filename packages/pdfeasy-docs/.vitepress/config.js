import defines from './define';

/**
 * @type {import('vitepress').UserConfig}
 */
export default {
  base: '/',
  ...defines,
  head: [
    ['meta', { name: 'author', content: 'Novout' }],
    ['meta', { name: 'keywords', content: 'pdfeasy, pdfkit, pdf, words, vitepress' }],
    ['link', { rel: 'icon', href: '/logo.png' }],

    ['meta', { name: 'HandheldFriendly', content: 'True' }],
    ['meta', { name: 'MobileOptimized', content: '320' }],
    ['meta', { name: 'theme-color', content: '#0ea5e9' }],

    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: defines.site }],
    ['meta', { name: 'twitter:title', value: defines.title }],
    ['meta', { name: 'twitter:description', value: defines.description }],
    ['meta', { name: 'twitter:image', content: defines.image }],

    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:site', content: defines.site }],
    ['meta', { property: 'og:site_name', content: defines.title }],
    ['meta', { property: 'og:title', content: defines.title }],
    ['meta', { property: 'og:image', content: defines.image }],
    ['meta', { property: 'og:description', content: defines.description }],
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Github', link: 'https://github.com/Novout/pdfeasy' },
    ],
    sidebar: [
      {
        text: 'Guide',
        children: [
          { text: 'Installation', link: '/guide/install' },
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Client-Server Side', link: '/guide/client-server-side' }
        ],
      },
      {
        text: 'Document',
        children: [
          { text: 'Text', link: '/document/text' },
          { text: 'Stack', link: '/document/stack' },
          { text: 'Images', link: '/document/images' },
          { text: 'Svg', link: '/document/svg' },
        ],
      },
      {
        text: 'Options',
        children: [
          { text: 'Definitions', link: '/options/definitions' },
          { text: 'Info', link: '/options/info' },
          { text: 'Fonts', link: '/options/fonts' },
          { text: 'Page', link: '/options/page' },
          { text: 'Plugins', link: '/options/plugins' },
        ],
      },
    ],
  },
}
