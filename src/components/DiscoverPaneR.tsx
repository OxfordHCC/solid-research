import { h, Component, VNode } from 'preact';
import { Props } from './types';
import Carousel, { CarouselElement } from './Carousel';
import AddPopup from './AddPopup';
import AddFriends from './AddFriends';
import Logout from './Logout';
import { useAuthentication } from './authentication';
import { loadData, MediaData, getIds, search } from '../media';
import { getSolidDataset, deleteSolidDataset, SolidDataset, WithAcl, WithServerResourceInfo, WithAccessibleAcl, getContainedResourceUrlAll, getUrl, getStringNoLocaleAll, hasResourceAcl, getUrlAll, getThing, getThingAll, setGroupDefaultAccess, setGroupResourceAccess, getSolidDatasetWithAcl, createAcl, saveAclFor, setAgentDefaultAccess, setAgentResourceAccess, removeThing, createThing, saveSolidDatasetAt, setUrl, setDatetime, setThing, setInteger, asUrl, getInteger, createSolidDataset, createContainerAt, addUrl, removeUrl, getResourceAcl, setStringNoLocale, addStringNoLocale, getPublicResourceAccess, getPublicAccess, setPublicDefaultAccess, setPublicResourceAccess, getGroupAccess } from '@inrupt/solid-client';
import { DCTERMS, RDF, SCHEMA_INRUPT } from '@inrupt/vocab-common-rdf';
// import {shuffle} from '../lib';

import { logout } from '@inrupt/solid-client-authn-browser';

import { HOMEPAGE } from '../env';

import * as $rdf from "rdflib"

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'long',
};

const NO_ACCESS = {
	read: false,
	write: false,
	append: false,
	control: false,
};

const FULL_ACCESS = {
	read: true,
	write: true,
	append: true,
	control: true,
};

const READ_ACCESS = {
	read: true,
	write: false,
	append: false,
	control: false,
};

export type MovieData = {
	movie: string,
	solidUrl: string,
	watched: boolean,
	title: string,
	released: Date,
	image: string,
	dataset: any,
	me: boolean,
	friend: boolean,
};

type State = {
	myWatched?: string[],
	myUnwatched?: string[],
	myLiked?: string[],
	friendWatched?: string[],
	friendUnwatched?: string[],
	friendLiked?: string[],
	recommendedDict?: string[],
	movies?: {[key: string]: MovieData},
	loading?: boolean,
};

export default class DiscoverPane extends Component<{globalState: {state: any}}> {
	state = {
		addPopup: false,
		addFriends: false,
		showLogout: false,
	};

	public render({globalState}: Props<{globalState: {state: State, setState: (state: Partial<State>) => void}}>): VNode {
		const session = useAuthentication();
		if (!session) return <div />;

		const webID = session.info.webId!;
		const parts = webID.split('/');
		const pod = parts.slice(0, parts.length - 2).join('/');

		if (!globalState.state.loading) {
			globalState.setState({
				loading: true,
			});

			(async () => {
				let loadingStart = (new Date()).getTime();


				// creates an object of {type: {user or friend}, id: {users webID or friends webID}}

				const people = [{type: 'me', id: webID}];

				// creates a list of movies including users and their friends movies data
				const movieList = (await Promise.all(people.map(async x => {
					try {
						const parts = x.id.split('/');
						const pod = parts.slice(0, parts.length - 2).join('/');

						// getting movies from the user and their friends movies pod
						const moviesDataset = await getSolidDataset(`${pod}/movies/`, {fetch: session.fetch});

						const movies = getContainedResourceUrlAll(moviesDataset);

						// adds the url to the specfic movie resource to the movies list
						return movies.map(m => ({...x, url: m}));
					} catch {
						return [];
					}
				}))).flat(1);

				const test_start = (new Date()).getTime();
				const movies = await Promise.all(
					movieList.map(async ({type, url}) => {
						// iterating through all movies (user + their friends)
						const movieDataset = await getSolidDataset(url, {fetch: session.fetch});

						// fetching the stored metadata for each movie
						const movieThing = getThing(movieDataset, `${url}#it`)!;

						const things = getThingAll(movieDataset);

						// checking if the user has watched the movie
						const watched = things.some(x => getUrl(x, RDF.type) === 'https://schema.org/WatchAction');

						// checking if the user has reviewed this movie
						const review = things.find(x => getUrl(x, RDF.type) === 'https://schema.org/ReviewAction');

						const urls = getStringNoLocaleAll(movieThing, 'https://schema.org/sameAs');

						const [tmdbUrl] = urls.filter(x => x.startsWith('https://www.themoviedb.org/'));

						// fetch current movie assets from imdb API
						const {title, released, icon} = await loadData(tmdbUrl);

						return {movie: tmdbUrl, solidUrl: url, type, watched, title, released, image: icon, dataset: movieDataset};
					})
				);
				console.log(((new Date()).getTime() - test_start)/1000 + ' seconds')

				const movieDict: {[key: string]: MovieData} = {};
				const myWatched: string[] = [];
				const myUnwatched: string[] = [];
				const myLiked: string[] = [];
				const friendWatched: string[] = [];
				const friendUnwatched: string[] = [];
				const friendLiked: string[] = [];
				const recommendedDict: string[] = [];

				for (const {type, ...movie} of movies) {
					switch (type) {
						case 'me': {
							movieDict[movie.movie] = {...movie, me: true, friend: movieDict[movie.movie]?.friend};

							// if the movie has been watched & check if the same movie does not already exist in the watched list
							if (movie.watched && !myWatched.includes(movie.movie)) {
								myWatched.push(movie.movie);
							}

							// if the user liked the movie and it doesn't already exist in myLiked

						} break;
					}
				}

				globalState.setState({
					myWatched,
					myLiked,
					movies: movieDict,
				});
			})();
		}


		const createCarouselElement = (movie: string, type: 'friend' | 'me'): VNode => {
			const movieData = globalState.state.movies![movie];
			const {solidUrl, watched, title, released, image} = movieData;
			let {dataset} = movieData;

			switch (type) {
				case 'me': {
					return (
						<CarouselElement
							title={title}
							subtitle={released.toLocaleDateString('en-GB', DATE_FORMAT)}
							image={image}
							redirect={`${HOMEPAGE}/view?url=${movie}`}
						/>
					);
				}

				case 'friend': {
					return (
						<CarouselElement
							title={title}
							subtitle={released.toLocaleDateString('en-GB', DATE_FORMAT)}
							image={image}
							redirect={`${HOMEPAGE}/view?url=${movie}`}
						/>
					);
				}
			}
		}

		return (
			<div class="movies-page">
				<div class="logo-container">
					<img src={'./assets/logo.png'}></img>
				</div>
				{globalState.state.myWatched && globalState.state.myWatched.length != 0 &&
					<div>
						<h3 style="margin-left: 2%;">Your Collection</h3>
						<Carousel>{(globalState.state.myWatched ?? []).map(x => createCarouselElement(x, 'me'))}</Carousel>
					</div>
				}
				{globalState.state.myLiked && globalState.state.myLiked.length != 0 &&
					<div>
						<h3 style="margin-left: 2%;">You enjoyed</h3>
						<Carousel>{(globalState.state.myLiked ?? []).map(x => createCarouselElement(x, 'me'))}</Carousel>
					</div>
				}

				{this.state.showLogout && <Logout
					close={() => {
						this.setState({showLogout: false});
					}}
					add={() => {
						this.setState({showLogout: false});
					}}
				/>
				}
			</div>
		);
	}
}
