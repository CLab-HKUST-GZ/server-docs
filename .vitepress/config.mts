import { DefaultTheme, defineConfig, UserConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar';

// https://vitepress.dev/reference/site-config
const vitepressConfig: UserConfig<DefaultTheme.Config> = {
  title: "CLab Server Docs",
  description: "A VitePress Site",
  base: "/server-docs/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '文档主页', link: '/' },
      { text: '用户指南', link: '/userguide' },
      { text: '迁移指南', link: '/migration' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
  }
}

export default defineConfig(withSidebar(vitepressConfig, {
  useTitleFromFileHeading: true,
  useFolderTitleFromIndexFile: true,
}))