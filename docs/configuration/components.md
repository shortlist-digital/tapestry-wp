# Components

Tapestry requires that you pass it React compenents for each of the WordPress API content endpoints.

Ultimately you only need to configure templates your site will use, generally these are:

---
## `Post`

The template for rendering a single post. The top level component will be passed the response from a `/wp-json/wp/v2/posts` endpoint as [props](https://facebook.github.io/react/docs/components-and-props.html)

```js
const Post = props =>
  <article>
    <h2>{props.title.rendered}</h2>
    <p>{props.the_content.rendered}</p>
  </article>

export default Post
```

---
## `Page`

The template for rendering a page. The top level component will be passed the response from a `/wp-json/wp/v2/pages` endpoint as [props](https://facebook.github.io/react/docs/components-and-props.html)

```js
const Page = props =>
  <section>
    <img src={props._embedded['wp:featuredmedia'][0].source_url} />
    <h2>{props.title.rendered}</h2>
    <p>{props.the_content.rendered}</p>
  </section>

export default Page
```

