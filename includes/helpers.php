<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if(! class_exists('StorePictureHelper')) :
  class StorePictureHelper{

		static public function default_settings() {
			return apply_filters('_sp_filter_data_settings', array(
				/* general */
				'main_color' 									=> '#6E6DF6',
				'second_color' 								=> '#00FCE0',
				/* instagram */
				'instagram_client_id' 				=> '',
				'instagram_client_secret' 		=> '',
				'instagram_access_token' 			=> [],
				/* firebase */
				'firebase_api_key' 						=> '',
				'firebase_auth_domain' 				=> '',
				'firebase_database_url' 			=> '',
				'firebase_project_id' 				=> '',
				'firebase_storageBucket' 			=> '',
				'firebase_messaging_sender_id' 	=> '',
			));
		}

    static public function load_template($path = null, $params = array(), $echo = false) {
      extract($params);

      ob_start(); include $path;
      $output = ob_get_clean();

      if($echo == true)
        echo $output;
      else
        return $output;
    }

		/**
	   * @since 1.0.0
	   * @param $s [string]
	   */
	  static public function search_woo_product_by_name($s = null) {
	    $args = array(
	    	'post_type'     => 'product',
	      'post_status'   => 'publish',
	    	's'             => $s,
	    );

	    return get_posts( $args );
	  }

    /**
     * @since 1.0.0
     * @param $post_id [int]
     */
    static public function get_store_picture_metabox_by_id($post_id, $returnType = '') {
			$store_picture_data = get_post_meta($post_id, '_store_picture_data', true);

			if($returnType == 'ARRAY') { $store_picture_data = json_decode($store_picture_data, true); }

			return $store_picture_data;
    }

		static public function get_current_post_type() {
			global $post, $typenow, $current_screen;

			//we have a post so we can just get the post type from that
			if ( $post && $post->post_type )
				return $post->post_type;

			//check the global $typenow - set in admin.php
			elseif( $typenow )
				return $typenow;

			//check the global $current_screen object - set in sceen.php
			elseif( $current_screen && $current_screen->post_type )
				return $current_screen->post_type;

			//lastly check the post_type querystring
			elseif( isset( $_REQUEST['post_type'] ) )
				return sanitize_key( $_REQUEST['post_type'] );

			//we do not know the post type!
			return null;
		}

		static public function update_settings($data) {
			update_option( 'store_picture_settings', $data );
		}

		static public function get_settings() {
			return get_option('store_picture_settings', self::default_settings());
		}

		static public function search_picture_data_by_key($storePictureData = array(), $key = '') {
			if(! is_array($storePictureData) && count($storePictureData) <= 0) return;

			$found_key = array_search($key, array_column($storePictureData, 'key'));
			return $storePictureData[$found_key];
		}
  }
endif;
