# Motivation
---

## Building for WordPress with Server Side Rendered React

Tapestry WP is a new project from the internal tech team of Shortlist Media: [Shortlist.Studio](http://shortlist.studio). We're long time advocates of using WordPress to deliver projects rapidly and dependably. And we're excited to release this cutting edge tool into the wild.

### CMS functionality for 'free'
As a content driven company, the efficiencies we enjoy by committing to a suite of tools for user management: (including password resets, security, email), content tagging and categorisation (tags, categories and custom taxonomies), and content creation, ensure we can focus on delivering functionality, and fast, good-looking front-ends in the browser.

### A front-end approach that's showing it's age

The limiting factor in using WordPress for fast, modern front-ends, has traditionally been in theme world. "The Loop", PHP templating and the enqueuing system for static assets, all contribute to a clunky developer and user experience.

### Build for WordPress like it's 2017

There's been in uptick in developers around the world using the WP-API to build the front-end of their sites with React, Angular, and Vue.js and other modern tools. We've been using React at [Shortlist.Studio](http://shortlist.studio) for a few years now, and with the weight of big names like Facebook, Netflix and the BBC behind it, we feel like it's a safe bet to invest in long term.

### Holy Grail: Easy SSR and zero-config WP integration

The most common draw back we've seen of when other developers have implemented a WordPress theme with a Javascript Framework, is that they've lost server side rendering. 

We share `Next.js` creator Guillermo Rauch's belief that [server  rendered pages are not optional](https://rauchg.com/2014/7-principles-of-rich-web-applications#server-rendered-pages-are-not-optional) - Here's an extract of the TL;DR; from principle 1

```
tl;DR: Server rendering is not about SEO, it’s about performance.
```

Server Side Rendering Javascript Apps has been somewhat of a holy grail for Web Developers for a few years now. With the advent of Node.js, and Libraries like React.js and Vue.js, it has now become a reality.

If you've ever tried Server Side Rendering React - you'll know it's a bit of a pain. However as Tapestry WP is loading against a dependable and predictable API (WP-API, obviously), and as we know you just want to render your Post, Page, Archive etc components on the Server and on the the client - we've handled all of the Data loading from the WP-API for you.

### Pain point: Routing Ambiguity

Before we started building `tapestry-wp`, we had no idea about the complexities of routing. TL;DR: It's quite difficult.

WordPress router is fairly complex, and from what we understand - slow.

Ostensibly it works like this:

* Receive a full permalink `/food/cheese`
  * This looks like a category and a sub category to a human but it WordPress it could actually be:
    * `/category/sub-category`
    * `/category/post`
    * `/category/page`
    * `/page/child-page`

* *Magic happens*: Run multiple queries across the database to reconcile what `post_type` should be rendered and what data should be loaded with it.
* Render: the correct template, with the right data

WP-API doesn't have a router, you have to pass an `id` or a `slug` parameter to the endpoint relevant to the data you require, most of the time `/posts`, or `/pages`.

This means that we have to recreate the *Magic Happens* step in `tapestry-wp` using React Router. What we want to avoid in that instance is making multiple request to resolve a route. Here's a worst case scenario:

* Receive a full permalink `/food/cheese`
  * Optimistically hit posts endpoint, then page endpoint, then category
    * `/category/post` // 404
    * `/category/page` // 404
    * `/page/child-page` // No need to hit page again
    * `/category/sub-category` // 200 -> Render page

In this hypothetical situation, we had to make 3 HTTP requests in total to find the data we need. **This is _pretty bad_, we don't want to be that slow.**

Leveraging caching on the server, this isn't too bad, but in the name of keeping our front-end snappy, we'd like to complete this  request in one go on the client.

### Routing unamibiguously

So how do we solve this? One way to do this if you're starting from scratch in a project is to route unambiguously. By this we mean:

> The routes in our front-end have a one-to-one mapping with resource endpoints in `WP-API`, with no overlap

For example:

```
/post/{post-slug}
/category/{category}/{sub-category}
/page/{page-slug}
/term/{term-slug}
```
  
With this configuration, the router knows _unambigously_ which WP-API endpoint to request data from on every match from the router.

