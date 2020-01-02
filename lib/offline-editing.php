<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Silence is golden.' );
}

function gutenberg_register_offline_editing_service_worker_script( $scripts ) {
	$scripts->register(
		'gutenberg-offline-editing',
		array(
			'src'  => 'https://pwa.wordpress.test/wp-content/plugins/gutenberg/lib/offline-editing.js',
			'deps' => array( 'wp-base-config' ),
		)
	);
}

add_action( 'wp_admin_service_worker', 'gutenberg_register_offline_editing_service_worker_script' );
