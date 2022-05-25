export default function (router) {
  router.beforeEach(async (to, from, next) => {
    // 修改页面title
    const reg = new RegExp(/^(.+)(\s\|\s.+)$/);
    const appTitle = import.meta.env.VITE_APP_TITLE;

    document.title = !to.meta.title
      ? appTitle
      : appTitle.match(reg)
      ? appTitle.replace(reg, `${to.meta.title}$2`)
      : `${to.meta.title} | ${appTitle}`;
    next();
  });
}
