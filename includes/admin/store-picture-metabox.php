<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if(! class_exists('StorePictureCustomMetabox')) :
  class StorePictureCustomMetabox{
    function __construct() {
      add_action( 'add_meta_boxes', array($this, 'load_custom_metabox'), 10, 2 );
      add_action( 'save_post', array($this, 'save_custom_meta_box') );
    }

    function load_custom_metabox($post_type, $post) {
      add_meta_box(
        'store-picture-custom-metabox',
        __( 'Store Settings' , 'store-picture' ),
        array($this, 'render_custom_metabox'),
        'store-picture',
        'normal',
        'default'
      );
    }

    function render_custom_metabox($post) {
      StorePictureHelper::load_template( STOREPICTURE_PLUGIN_TEMPLATES . 'admin/store-picture-custom-metabox.php', array('post' => $post), true );
    }

    /**
     * Save meta box content.
     *
     * @param int $post_id Post ID
     */
    function save_custom_meta_box( $post_id ) {

      $post_type = get_post_type($post_id);
      if ( "store-picture" != $post_type ) return;

      if ( isset( $_POST['_store_picture_data'] ) ) {
        update_post_meta( $post_id, '_store_picture_data', $_POST['_store_picture_data'] );
      }
    }

  }

  new StorePictureCustomMetabox();
endif;
