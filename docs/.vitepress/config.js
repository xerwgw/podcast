export default {
    title: 'ξερωγώ;',
    description: 'Το official website του Ξέρω Γώ; podcast',
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Επεισόδια', link: '/podcasts.md' },
        // { text: 'External', link: 'https://google.com' },
      ],
    },
    head: [
      [
        'script',
        {
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-7XQVKX6RHR',
        },
      ],
      [
        'script',
        {},
        "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-7XQVKX6RHR');",
      ],
    ],
  };