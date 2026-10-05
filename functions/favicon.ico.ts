// 处理浏览器自动发起的 /favicon.ico 请求。
// 页面上没有引用图标时浏览器仍会请求它，若落到 [[default]].ts 兜底路由，
// 会因为解析不出 GitHub 链接而返回 400 Bad Request（控制台报错来源之一）。
export function onRequest() {
  return new Response(null, {
    status: 204,
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
