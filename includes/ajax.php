<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if(! function_exists('sp_woo_search_tool_items_render') ):
  function sp_woo_search_tool_items_render() {
    extract($_POST);
    $results = StorePictureHelper::search_woo_product_by_name($s); // print_r($results);
    $output = '';

    if( !is_array($results) || count($results) <= 0 ) exit();

    foreach($results as $item) :
      $thumb_url = '';

      if(get_the_post_thumbnail_url($item->ID)) :
        $thumb_url = get_the_post_thumbnail_url($item->ID, 'thumbnail');
      endif;

      $output .= implode('', array(
        '<div class="p-item" data-pid="'. $item->ID .'">',
          '<div class="p-thumbnail">',
            '<img src="'. $thumb_url .'" alt="#">',
          '</div>',
          '<div class="p-title">'. $item->post_title .'</div>',
        '</div>',
      ));
    endforeach;

    echo $output; exit();
  }

  add_action( 'wp_ajax_sp_woo_search_tool_items_render', 'sp_woo_search_tool_items_render' );
  add_action( 'wp_ajax_nopriv_sp_woo_search_tool_items_render', 'sp_woo_search_tool_items_render' );
endif;

if(! function_exists('sp_woo_product_html_render')) :
  function sp_woo_product_html_render() {
    extract($_POST);
		global $post;
    $product = new WC_product($pid);
    $temp = implode('', array(
      '<div class="p-thumb">',
        '<a href="{link}">{featured_image}</a>',
      '</div>',
      '<div class="p-entry">',
        '<a href="{link}" class="p-link" target="_blank"><div class="title">{title}</div></a>',
				'{add_to_cart_button}',
      '</div>',
    ));

    $variables = array(
      '{ID}'              		=> $pid,
      '{title}'           		=> $product->get_title(),
      '{link}'            		=> $product->get_permalink(),
      '{featured_image}'  		=> sprintf('<img src="%s" alt="no image" class="p-thumbnail">', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/images/no-image.jpg'),
      '{price}'           		=> $product->get_price_html(),
			'{add_to_cart_button}' 	=> do_shortcode("[add_to_cart id={$pid} style='FALSE' class='sp-woo-add-to-cart']"),
    );

    if(has_post_thumbnail($pid)) :
      $variables['{featured_image}'] = get_the_post_thumbnail( $pid, 'thumbnail', array( 'class' => 'p-thumbnail' ) );
    endif;

    echo str_replace(array_keys($variables), array_values($variables), $temp);
    exit();
  }

  add_action( 'wp_ajax_sp_woo_product_html_render', 'sp_woo_product_html_render' );
  add_action( 'wp_ajax_nopriv_sp_woo_product_html_render', 'sp_woo_product_html_render' );
endif;

if(! function_exists('sp_get_thumbnail')) :
  function sp_get_thumbnail_src() {
    extract($_POST);

    $output = plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/images/no-image-2.jpg';
    $image_attributes = wp_get_attachment_image_src($attachment_id, $size);
    if ( $image_attributes )  $output = $image_attributes[0];

    echo $output;
    exit();
  }

  add_action( 'wp_ajax_sp_get_thumbnail_src', 'sp_get_thumbnail_src' );
  add_action( 'wp_ajax_nopriv_sp_get_thumbnail_src', 'sp_get_thumbnail_src' );
endif;

if(! function_exists('sp_get_store_picture_data')) :
  function sp_get_store_picture_data() {
    extract($_POST);

    echo StorePictureHelper::get_store_picture_metabox_by_id($pid);
    exit();
  }

  add_action( 'wp_ajax_sp_get_store_picture_data', 'sp_get_store_picture_data' );
  add_action( 'wp_ajax_nopriv_sp_get_store_picture_data', 'sp_get_store_picture_data' );
endif;

if(! function_exists('sp_get_all_store_picture')) :
	/**
	 * sp_get_all_store_picture
	 */
	function sp_get_all_store_picture() {
		$args = array(
			'post_type'     => 'store-picture',
			'post_status'   => 'publish',
		);

		$posts = get_posts( $args );
		$result = array();

		if($posts && count($posts) > 0) :
			foreach($posts as $post) :
				array_push($result, array(
					'ID' => $post->ID,
					'slug' => $post->post_name,
					'title' => $post->post_title,
				));
			endforeach;
		endif;

		echo json_encode($result);
		exit();
	}

	add_action( 'wp_ajax_sp_get_all_store_picture', 'sp_get_all_store_picture' );
  add_action( 'wp_ajax_nopriv_sp_get_all_store_picture', 'sp_get_all_store_picture' );
endif;

if(! function_exists('sp_save_settings')) :
	function sp_save_settings() {
		extract($_POST);
		StorePictureHelper::update_settings($data);
		exit();
	}
	add_action( 'wp_ajax_sp_save_settings', 'sp_save_settings' );
  add_action( 'wp_ajax_nopriv_sp_save_settings', 'sp_save_settings' );
endif;

if(! function_exists('sp_instagram_get_auth_link')) :
	function sp_instagram_get_auth_link() {
		extract($_POST);

		$site_url = get_site_url();
		$instagram = new Andreyco\Instagram\Client(array(
			'apiKey' 				=> $data['instagram_client_id'],
			'apiSecret' 		=> $data['instagram_client_secret'],
			'apiCallback' 	=> $site_url, // get_site_url(),
			'scope'       	=> array('public_content', 'basic', 'likes'),
		));

		$loginUrl = $instagram->getLoginUrl();

		echo $loginUrl;
		exit();
	}
	add_action( 'wp_ajax_sp_instagram_get_auth_link', 'sp_instagram_get_auth_link' );
  add_action( 'wp_ajax_nopriv_sp_instagram_get_auth_link', 'sp_instagram_get_auth_link' );
endif;

if(! function_exists('sp_instagram_get_oauth_token')) :
	function sp_instagram_get_oauth_token() {
		extract($_POST);

		$instagram = new Andreyco\Instagram\Client(array(
			'apiKey' 				=> $data['instagram_client_id'],
			'apiSecret' 		=> $data['instagram_client_secret'],
			'apiCallback' 	=> get_site_url(),
			'scope'       	=> array('public_content', 'basic', 'likes'),
		));

		$data = $instagram->getOAuthToken($data['instagram_auth_code']);

		echo json_encode($data);
		exit();
	}
	add_action( 'wp_ajax_sp_instagram_get_oauth_token', 'sp_instagram_get_oauth_token' );
  add_action( 'wp_ajax_nopriv_sp_instagram_get_oauth_token', 'sp_instagram_get_oauth_token' );
endif;

if(! function_exists('sp_get_instagram_media')) :
	function sp_get_instagram_media() {
		if(StorePictureInstagramHelper::validateParams()) {
			$instagram = new StorePictureInstagramHelper();
			$userMedia = $instagram->getUserMedia();

			echo json_encode(array(
				'status' 	=> 200,
				'result'	=> $userMedia,
			));
		} else {
			echo json_encode(array(
				'status' 	=> 301,
				'message' => __('Instagram API settings missing.', 'store-picture'),
			));
		}
		exit();
	}
	add_action( 'wp_ajax_sp_get_instagram_media', 'sp_get_instagram_media' );
  add_action( 'wp_ajax_nopriv_sp_get_instagram_media', 'sp_get_instagram_media' );
endif;

if(! function_exists('sp_get_post_link')) :
	function sp_get_post_link() {
		$url = add_query_arg( array(
	    'sid' => '[SHAREID]',
		), get_permalink($_POST['pid']));
		echo $url;
		exit();
	}
	add_action( 'wp_ajax_sp_get_post_link', 'sp_get_post_link' );
  add_action( 'wp_ajax_nopriv_sp_get_post_link', 'sp_get_post_link' );
endif;
