// array of routes supplied with Tapestry
export default ({
  FrontPage, Post, Page, Category
}) => [{
  path: '/',
  component: FrontPage,
  endpoint: 'posts?_embed'
}, {
  path: ':page(/:subpage)',
  component: Page,
  endpoint: params => `pages?slug=${params.subpage || params.page}&_embed`
}, {
  path: '/category/:category(/:subcategory)',
  component: Category,
  endpoint: params => `posts?slug=${params.postname}&_embed`
}, {
  path: '/:year/:monthnum/:day/:postname',
  component: Post,
  endpoint: params => `posts?slug=${params.postname}&_embed`
}, {
  path: '*',
  component: Error
}]
