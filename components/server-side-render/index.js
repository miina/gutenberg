/**
 * External dependencies.
 */
import { isEqual } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	Component,
	RawHTML,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export class ServerSideRender extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			response: null,
		};
	}

	componentDidMount() {
		this.fetch( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		if ( ! isEqual( nextProps, this.props ) ) {
			this.fetch( nextProps );
		}
	}

	fetch( props ) {
		this.setState( { response: null } );
		const { block } = props;
		const attributes = Object.assign( {}, props );

		// Delete 'block' from attributes, only registered block attributes are allowed.
		delete attributes.block;

		let apiURL = this.getQueryUrlFromObject( {
			attributes: attributes,
		} );

		apiURL = '/gutenberg/v1/block-renderer/' + block + '?' + apiURL;

		return wp.apiRequest( { path: apiURL } ).then( response => {
			if ( response && response.rendered ) {
				this.setState( { response: response.rendered } );
			}
		} );
	}

	getQueryUrlFromObject( obj, prefix ) {
		const str = [];
		let param;
		for ( param in obj ) {
			if ( obj.hasOwnProperty( param ) ) {
				const key = prefix ? prefix + '[' + param + ']' : param,
					value = obj[ param ];
				str.push(
					( value !== null && 'object' === typeof value ) ?
						this.getQueryUrlFromObject( value, key ) :
						encodeURIComponent( key ) + '=' + encodeURIComponent( value )
				);
			}
		}
		return str.join( '&' );
	}

	render() {
		const response = this.state.response;
		if ( ! response || ! response.length ) {
			return (
				<div key="loading" className="wp-block-embed is-loading">

					<p>{ __( 'Loading...' ) }</p>
				</div>
			);
		}

		return (
			<RawHTML key="html">{ response }</RawHTML>
		);
	}
}

export default ServerSideRender;
