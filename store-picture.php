<?php
/**
 * @package Store Picture
 */
/*
Plugin Name: Store Picture App
Plugin URI: http://spapp.sophierepo.com/
Description: This plugin is a addon of WooCommerce. It allows you to turn Instagram followers into Customers. Make your Instagram feeds shoppable with this plugin today.
Version: 1.0.2
Author: Huynh
Author URI: https://sophierepo.com/
License: GPLv2 or later
Text Domain: store-picture
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if(! class_exists('StorePicture')) :

  require __DIR__ . '/vendor/autoload.php';

  class StorePicture{
    public $version = '1.0.1';
    public $debug = true;
    protected static $_instance = null;

    /**
     * Main StorePicture Instance.
     *
     * Ensures only one instance of StorePicture is loaded or can be loaded.
     *
     * @since 1.0
     * @static
     * @see StorePicture()
     * @return StorePicture - Main instance.
     */
    public static function instance() {
      if ( is_null( self::$_instance ) ) {
        self::$_instance = new self();
      }
      return self::$_instance;
    }

    public function __construct() {
			if (! in_array(
				'woocommerce/woocommerce.php',
				apply_filters( 'active_plugins', get_option( 'active_plugins' ) )
			)) {
				return;
			}

      $this->define_constants();
      $this->includes();
      $this->init_hooks();

      do_action( 'StorePicture_action' );
    }

    public function define_constants() {
      $this->define( 'STOREPICTURE_PLUGIN_FILE', __FILE__ );
      $this->define( 'STOREPICTURE_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
      $this->define( 'STOREPICTURE_PLUGIN_TEMPLATES', plugin_dir_path( __FILE__ ) . 'templates/' );
      $this->define( 'STOREPICTURE_DEBUG', $this->debug );
      $this->define( 'STOREPICTURE_VERSION', $this->version );
    }

    public function includes() {
      /* helper */
      include plugin_dir_path( __FILE__ ) . 'includes/helpers.php';
      include plugin_dir_path( __FILE__ ) . 'includes/ajax.php';
      include plugin_dir_path( __FILE__ ) . 'includes/scss-helpers.php';
      include plugin_dir_path( __FILE__ ) . 'includes/instagram-helpers.php';

			include plugin_dir_path( __FILE__ ) . 'includes/frontend.php';

      /* admin */
      include plugin_dir_path( __FILE__ ) . 'includes/admin/admin.php';
      include plugin_dir_path( __FILE__ ) . 'includes/admin/store-picture-metabox.php';

			/* shortcode */
			$this->load_shortcode();
    }

		public function load_shortcode() {
			include plugin_dir_path( __FILE__ ) . 'shortcode/store-picture.php';
		}

    public function init_hooks() {
      add_action( 'init', array( $this, 'init' ), 10 );
			add_action( 'wp_enqueue_scripts', array($this, 'enqueue_scripts') );
    }

		public function enqueue_scripts() {
			/* icon */
			wp_enqueue_style('icon_font_ionic', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/icons/ionic/css/ionicons.min.css', false, STOREPICTURE_VERSION);

			wp_enqueue_style('nanoscroller', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/nanoscroller/nanoscroller.css', false, STOREPICTURE_VERSION);
	    wp_enqueue_script('nanoscroller', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/nanoscroller/jquery.nanoscroller.min.js', array('jquery'), STOREPICTURE_VERSION, true);

			/* vue */
			wp_enqueue_script('vue', plugin_dir_url( __FILE__ ) . 'assets/javascripts/vue.js', array(), STOREPICTURE_VERSION, true);

			/* anime */
			wp_enqueue_script('anime', plugin_dir_url( __FILE__ ) . 'assets/javascripts/anime.min.js', array('jquery'), STOREPICTURE_VERSION, true);

			/* isotope */
			wp_enqueue_script('isotope', plugin_dir_url( __FILE__ ) . 'assets/javascripts/isotope.pkgd.min.js', array('jquery'), STOREPICTURE_VERSION, true);

			/* store_picture_custom_masonry */
			wp_enqueue_script('store_picture_custom_masonry', plugin_dir_url( __FILE__ ) . 'assets/javascripts/jquery.custom-masonry.js', array('jquery', 'isotope'), STOREPICTURE_VERSION, true);

			/* nanoscroller */
			wp_enqueue_style('nanoscroller', plugin_dir_url( __FILE__ ) . 'assets/nanoscroller/nanoscroller.css', false, STOREPICTURE_VERSION);
			wp_enqueue_script('nanoscroller', plugin_dir_url( __FILE__ ) . 'assets/nanoscroller/jquery.nanoscroller.min.js', array('jquery'), STOREPICTURE_VERSION, true);

			/* sp_request */
			wp_enqueue_script('sp_request', plugin_dir_url( __FILE__ ) . 'assets/javascripts/jquery.spRequest.js', array('jquery'), STOREPICTURE_VERSION, true);

			/* vueCustomMasonry */
			wp_enqueue_script('vueCustomMasonry', plugin_dir_url( __FILE__ ) . 'assets/vueElementLibs/vue-custom-masonry.js', array('isotope', 'vue'), STOREPICTURE_VERSION, true);

			/* Small Confirm Tool */
	    wp_enqueue_script('small_confirm_tool', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/jquery.smallConfirmTool.js', array('jquery'), STOREPICTURE_VERSION, true);

			/* Woo Search Tool */
	    wp_enqueue_script('woo_search_tool', plugin_dir_url( __FILE__ ) . 'assets/javascripts/jquery.wooSearchTool.js', array('jquery'), STOREPICTURE_VERSION, true);

			/* vue medium editor */
			wp_enqueue_style('vueMediumEditor', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/medium-editor.min.css', false, STOREPICTURE_VERSION);
			wp_enqueue_script('vueMediumEditor', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/vueMediumEditor.min.js', array('vue'), false, STOREPICTURE_VERSION);

			/* vuePicturePoints */
	    wp_enqueue_script('vuePicturePoints', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/vuePicturePoints.js', array('jquery', 'vue'), STOREPICTURE_VERSION, true);

			/* vueStorepictureProductItem */
	    wp_enqueue_script('vueStorepictureProductItem', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/vueStorepictureProductItem.js', array('jquery', 'vue'), STOREPICTURE_VERSION, true);

			/* vueStorePictureModalEdit */
			wp_enqueue_script('vueStorePictureModalEdit', plugin_dir_url( __FILE__ ) . 'assets/vueElementLibs/vueStorePictureModalEdit.js', array('jquery', 'vue'), STOREPICTURE_VERSION, true);

			/* store-picture */
			wp_enqueue_style('store-picture', plugin_dir_url( __FILE__ ) . 'assets/styles/frontend/store-picture.css', false, STOREPICTURE_VERSION);
			wp_enqueue_script('store-picture', plugin_dir_url( __FILE__ ) . 'assets/javascripts/jquery.store-picture.js', array('jquery', 'vue'), STOREPICTURE_VERSION, true);

			/* wp_localize_script */
			wp_localize_script( 'sp_request', 'sp_object', array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'language' => array(
					'wp_media_title' => __('Select or Upload Media Of Your Chosen Persuasion', 'store-picture'),
					'wp_media_button_text' => __('Use this media', 'store-picture'),
				),
			));
		}

    public function init() {

    }

    /**
  	 * Define constant if not already set.
  	 *
     * @since 1.0.0
  	 * @param string $name
  	 * @param string|bool $value
  	 */
  	private function define( $name, $value ) {
  		if ( ! defined( $name ) ) {
  			define( $name, $value );
  		}
  	}
  }

  /**
   * Main instance of SophieCompare.
   *
   * Returns the main instance of StorePicture to prevent the need to use globals.
   *
   * @since  1.0.0
   * @return StorePicture
   */
  function StorePicture() {
  	return StorePicture::instance();
  }


  // Global for backwards compatibility.
  $GLOBALS['StorePicture'] = StorePicture();

endif;
