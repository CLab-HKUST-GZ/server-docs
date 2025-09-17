import DefaultTheme from "vitepress/theme";
import giscusTalk from "vitepress-plugin-comment-with-giscus";
import { useData, useRoute } from "vitepress";
import { toRefs } from "vue";

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
  },
  setup() {
    const { frontmatter } = toRefs(useData());
    const route = useRoute();

    giscusTalk(
      {
        repo: "CLab-HKUST-GZ/server-docs",
        repoId: "R_kgDOPTQ8Ow",
        category: "Comments",
        categoryId: "DIC_kwDOPTQ8O84CtfRO",
        lang: "zh-CN",
        locales: {
          "zh-Hans": "zh-CN",
          "en-US": "en",
        },
      },
      {
        frontmatter,
        route,
      },
      true
    );
  },
};
