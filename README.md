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

Once you have set up a Solid/WebID then you can log in and start to view publications. At the moment, you can't add publications through solid-research yet, which is a function upcoming.

## Future features
- Add publications
- Import publications from a bibtex
- Have the publication record visible/accessible for your co-authors

