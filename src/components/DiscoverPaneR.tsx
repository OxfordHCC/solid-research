import { h, Component, VNode } from 'preact';
import { Props } from './types';
import Carousel, { CarouselElement } from './Carousel';
import AddPopup from './AddPopup';
import AddFriends from './AddFriends';
import Logout from './Logout';
import { useAuthentication } from './authentication';
import { loadData, MediaData, getIds, search } from '../media';
import {
	getSolidDataset,
	getContainedResourceUrlAll,
	getStringNoLocaleAll,
	getThing,
	getThingAll,
	getDatetimeAll,
} from '@inrupt/solid-client';
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

export type PublicationData = {
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
	movies?: {[key: string]: PublicationData},
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
		//webID: https://testusermovie.solidcommunity.net/profile/card#me
		const webID = session.info.webId!;

		// parts: https://testusermovie.solidcommunity.net/
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

				// creates a list of publications for the user

				const publicationList = (await Promise.all(people.map(async x => {

					try {
						const parts = x.id.split('/');
						const pod = parts.slice(0, parts.length - 2).join('/');

						// getting publications from the user
						const publicationDataset = await getSolidDataset(`${pod}/publications/`, {fetch: session.fetch});

						const publications = getContainedResourceUrlAll(publicationDataset);

						// adds the url to the specific movie resource to the publications list
						return publications.map(m => ({...x, url: m}));
					} catch {
						return [];
					}
				}))).flat(1);

				const test_start = (new Date()).getTime();
				const publications = await Promise.all(
					publicationList.map(async ({type, url}) => {
						// iterating through all publications (user + their friends)
						const publicationDataset = await getSolidDataset(url, {fetch: session.fetch});

						// fetching the stored metadata for each ]
						const publicationThing = getThing(publicationDataset, `${url}#it`)!;

						const things = getThingAll(publicationDataset);

						// checking if the user has watched the movie
						// const watched = things.some(x => getUrl(x, RDF.type) === 'https://schema.org/WatchAction');
						const watched = true;

						// checking if the user has reviewed this movie
						// const review = things.find(x => getUrl(x, RDF.type) === 'https://schema.org/ReviewAction');

						// const urls = getStringNoLocaleAll(publicationThing, 'https://schema.org/sameAs');

						// const [tmdbUrl] = urls.filter(x => x.startsWith('https://www.themoviedb.org/'));
						// const [tmdbUrl] = ["https://www.themoviedb.org/movie/647030"];

						// fetch current movie assets from imdb API
						// const {icon} = await loadData(tmdbUrl);

						const title =  getStringNoLocaleAll(publicationThing, 'http://purl.org/dc/terms/title')[0];

						const released =  getDatetimeAll(publicationThing, 'http://purl.org/dc/terms/created')[0];
						const icon = getStringNoLocaleAll(publicationThing, 'https://schema.org/image')[0];


						return {movie: url, solidUrl: url, type, watched, title, released, image: icon, dataset: publicationDataset};
					})
				);
				console.log(((new Date()).getTime() - test_start)/1000 + ' seconds')

				const pubDict: {[key: string]: PublicationData} = {};
				const myWatched: string[] = [];


				for (const {type, ...movie} of publications) {
					switch (type) {
						case 'me': {
							pubDict[movie.movie] = {...movie, me: true, friend: false};

							// if the movie has been watched & check if the same movie does not already exist in the watched list
							if (movie.watched && !myWatched.includes(movie.movie)) {
								myWatched.push(movie.movie);
							}
						} break;
					}
				}

				globalState.setState({
					myWatched,
					movies: pubDict,
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
							// redirect={`${HOMEPAGE}/view?url=${movie}`}
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
