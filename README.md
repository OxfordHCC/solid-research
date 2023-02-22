- [Table of contents](#table-of-contents)
- [Welcome to Solid Media](#welcome-to-solid-media)
  * [Set up locally](#set-up-locally)
    + [Clone project and installations](#clone-project-and-installations)
  * [Getting started with Solid Media](#getting-started-with-solid-media)
    + [Log in with a WebID](#log-in-with-a-webid)
    + [Add movies](#add-movies)
    + [Sharing with friends](#sharing-with-friends)
    + [Personalised Movie Recommendations](#personalised-movie-recommendations)
  * [Application Architecture](#architecture)
  * [Development note](#development-note)
    + [Authentication](#authentication)
    + [Fetch movie data from a pod](#fetch-movie-data-from-a-pod)
    + [Add friends](#add-friends)
    + [Group authentication](#group-authentication)
    + [Future features](#future-features)


# Welcome to Solid Research

Solid Research is a demonstration of the use of [Solid](https://solidproject.org/) for managing and sharing an individual's research assets, such as publications, presentations, blog posts etc. It is a fork of [SolidFlix](https://github.com/OxfordHCC/solid-media).

**To play with the application you will need a WebID or a Solid pod provided by [solidcommunity.net](https://solidcommunity.net) or any other pod provider such as [Inrupt](https://inrupt.net/), [Solid Web](https://solidweb.org/), [solidweb.me](https://solidweb.me/) or using your self-hosted pod url**


## Set up locally

If you wish to deploy Solid-media locally, then please follow the instructions below to build the project.

Solidflix is developed using [Typescript](https://www.typescriptlang.org/) and [snowpack](https://www.snowpack.dev/tutorials/getting-started). If you are unfamiliar with them, then you will need to have your `npm` set up. Please follow [this tutorial](https://docs.npmjs.com/getting-started).


### Clone project and installations

1. Make a directory.

2. Clone on GitHub here:

`git clone git@github.com:OxfordHCC/solid-media.git`

3. `cd solid-media` into the directory.

4. Set up your `snowpack`

`(sudo) npm install --save-dev snowpack`

Run

`npm run start`

The application will be opened on your local web browser [http://localhost:8080](http://localhost:8080).


## Getting started with SolidResearch

### Add publication records in a Solid Pod
Some instructions about how to write publication records in a user's solid pod


### View your publications

To get started with sharing your movies, you will need a [WebID](https://solidcommunity.net) to log into the system, so that you can store movies on your Solid pod and share them with your friends. We recommend you register with [solidcommunity.net](https://solidcommunity.net). Alternatively, you could use  other supported pod providers such as [Inrupt](https://inrupt.net/), [Solid Web](https://solidweb.org/), [solidweb.me](https://solidweb.me/) or using your self-hosted pod url.

<img src="https://github.com/OxfordHCC/solid-media/blob/main/img/login.png" width="800" />

Once you have set up a Solid/WebID then you can log in and start to add movies to your pod.

<img src="https://github.com/OxfordHCC/solid-media/blob/main/img/options.png" width="400" />

After logging in, you'll be able to add movies, add friends, view your personalised movie recommendations, view your movies (watch history, liked and wishlisted movies), your friends movies (watch history, liked and wishlisted movies), like and wishlist movies.

<img src="https://github.com/OxfordHCC/solid-media/blob/main/img/users-movies.png" width="800" />


## Future features
- Add publications
- Import publications from a bibtex
- Have the publication record visible/accessible for your co-authors

