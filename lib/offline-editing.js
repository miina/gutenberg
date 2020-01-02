/* global wp, fetch, caches, ERROR_OFFLINE_URL, ERROR_MESSAGES, ERROR_500_URL */

// IIFE is used for lexical scoping instead of just a braces block due to bug with const in Safari.
( () => {
	const queue = new wp.serviceWorker.backgroundSync.Queue( 'gutenbergPendingEdits' );

	const editPostHandler = ( { url, event } ) => {
		const clone = event.request.clone();
		return fetch( event.request )
			.then( ( response ) => {
				return response;
			} )
			.catch( () => {
				const bodyPromise = clone.blob();
				bodyPromise.then(
					function( body ) {
						const request = event.request;
						const req = new Request( request.url, {
							method: request.method,
							headers: request.headers,
							mode: 'same-origin',
							credentials: request.credentials,
							referrer: request.referrer,
							redirect: 'manual',
							body,
						} );

						// Add request to queue.
						queue.pushRequest( {
							request: req,
						} );
					}
				);
			} );
	};

	wp.serviceWorker.routing.registerRoute(
		/\/index\.php/,
		editPostHandler,
		'POST'
	);
} )();
