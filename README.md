<a id="readme-top"></a>

<div align="center">
  <a href="https://github.com/vinsonio0920/blog-api">
    <img width="80" height="80" alt="Logo" src="https://github.com/user-attachments/assets/eaf1ec37-f391-4c26-9da6-bca4d638738d" />
  </a>


  <h3 align="center">Vinson Blogs</h3>

  <p align="center">
    My personal blog built from the ground up!
    <br />
  </p>
</div>

# blog-front-end-author

The author-side frontend website for the blog website. Here, users can create, update, and delete posts, create categories, manage comments, and more. In order to access this site, the user must also first be registered as an author. Do note though that signing in or entering the dashboard at first might result in a blank screen. Please wait a couple of seconds and the backend should eventually wake up, it's just a perk of Render's free plan!

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>

  <ol>
    <li>
      <a href="#introduction">Introduction</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li>
          <a href="#installation">Installation</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#acknowledgements">Acknowledgments</a></li>
  </ol>
</details>

## Introduction

Built with React Router, this website is a single page application (SPA) where users can create posts and categories along with managing the comments on their posts. Since it deals with the back end, the user will need to be signed in and made an author before being able to interact with the website. 


Some features of this website are:
* Creating, reading, updating, and deleting posts
* Dynamically create categories as need while making posts
* Managing and editing comments of a post
* Prisma pagination of posts and comments
* Single page application built through React Router
* Authentication using JWT tokens
* Fully fleshed out website design

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)
* [![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
* [![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](#)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To build on top of this project, follow the steps below to set up the project in your local environment!

### Prerequisites

* Make sure your package manager is updated to the latest version
  
  ```sh
  npm install npm@latest -g
  ```

* Install all dependencies

  ```sh
  npm install
  ```

* Set up the [Blog API](https://github.com/vinsonio0920/blog-api) and copy the server url. Make sure to copy your API's url!

* Sign in to your [TinyMCE](https://www.tiny.cloud/) account and copy the API key. Remember to add the frontend domain to the list of [approved domains](https://www.tiny.cloud/my-account/domains/)!

### Installation

1. Create an `.env` file in the `src` directory and add the following variables

  ```sh
  VITE_BLOG_API_WEBSITE=<your server url>
  VITE_TINYMCE_API_KEY=<your TinyMCE API key>
  ```

3. Run the application

  ```sh
  npm run dev
  ```

And you're done! Feel free make an account or sign in (remember you can use the same account from the user-side frontend!) to begin writing posts. If you haven't already, enroll yourself as the author, the code being the environment variable you set in your [Blog API](https://github.com/vinsonio0920/blog-api). 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

<img width="1668" height="958" alt="Image of the website homepage" src="https://github.com/user-attachments/assets/9e17d558-4226-49c2-a08f-864b4def4aae" />
<p align="center">
  <a href="https://vinsonstudio.netlify.app/">Visit the website</a>
</p>

This website is where all the interesting stuff happens. While the user-side frontend simply shows posts and allows for commenting, the author-side frontend is much more than that. A big part of the website is its CRUD functionality, which naturally means a lot of communication with the backend. The form here is also production-ready and can handle just about anything! Alongside that, it also has a preview and comments tab (edit mode) for convenience.

Authentification is required or the website will be locked. If you sign in and aren't an author, there will be a link to a form to make you an author. To create a post, click the "create post" link in the header to get sent to the create form. Fill out the form, submit (and fix any errors if applicable), and see your post on the dashboard! Click on a post to edit it or manage the post's comments, and the rest is up to you to easily discover. Don't worry, I believe in you! 

<p align="right">(<a href="#readme-top">back to top</a>)</p>
   
## Roadmap

The main focus here is the polishing and refactoring of the code to be more maintainable and easy to update. There are other features that are nice to have, but the main goals here are to make the code better and well structured.

- [ ] Refactor code
- [ ] Polish CSS (animations and transitions)
- [ ] Differentiate between error 404 and normal errors
- [ ] Add loading screen

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgements

Along with the major frameworks and libraries, there are also some lesser libraries that I would like to give a shoutout to. Before we begin, I'm going to just shoutout StackOverflow and The Odin Project for helping me get here!

* [date-fns](https://date-fns.org/) - This date formatter has never failed me. It's also quite intuitive and easy to use straight out the box
* [html-react-parser](https://www.npmjs.com/package/html-react-parser) - In order to actually output the content as HTML, this library is essential
* [DOMPurify](https://github.com/cure53/dompurify) - Of course, html-react-parser only parses the text into html. This is where DOMPurify comes in and sanitizes our code for us
* [jwt-decode](https://www.npmjs.com/package/jwt-decode) - In order to decode the JWT on our front end, this is the library that was used
* [jwt.io](https://www.jwt.io/) - This website helps you understand the underlying hash behind JWT tokens. I highly recommend taking a look at it!
* [TinyMCE](https://www.tiny.cloud/) - TinyMCE is a text editor that contains a generous free plan. It simplifies writing blog content a lot

<p align="right">(<a href="#readme-top">back to top</a>)</p>
