<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if(! function_exists('store_picture_shortcode_func')) :
	/**
	 * Shortcode [store-picture]
	 * @since 1.0.0
	 *
	 */
	function store_picture_shortcode_func( $atts ) {
	    $params = shortcode_atts( array(
	        'id' 			=> '',
	        'layout' 	=> 'grid',
	    ), $atts );
	    extract($params);

			if(empty($id) || empty($layout)) return;

			$layout_arr = array(
				'grid' => '<sp-custom-masonry v-if="storePicture.storePictureData.length > 0"></sp-custom-masonry>',
				'carousel' => '',
			);

	    return implode('', array(
				'<div class="sp-shortcode store-picture-wrap" data-vue-handle data-post-id="'. $id .'">',
					$layout_arr[$layout],
					'<sp-picture-edit v-if="modalControl.show" edit="false"></sp-picture-edit>',
				'</div>',
			));
	}
	add_shortcode( 'store-picture', 'store_picture_shortcode_func' );
endif;
