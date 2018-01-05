<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class StorePictureAdmin {

  function __construct() {
    add_action('admin_enqueue_scripts', array($this, 'load_admin_style'));
		add_filter('mce_external_plugins', array($this, 'enqueue_mce_plugin_scripts'));
		add_filter('mce_buttons', array($this, 'register_buttons_editor'));

    add_action('init', array($this, 'hook_init'));
		add_action('admin_menu', array($this, 'plugin_options_menu'));
  }

  function load_admin_style() {

		/* font-family */
		wp_register_style('store_picrure_admin_font', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/fonts/local-fonts.css', false, STOREPICTURE_VERSION);
    wp_enqueue_style('store_picrure_admin_font');

		/* icon */
		wp_register_style('icon_font_ionic', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/icons/ionic/css/ionicons.min.css', false, STOREPICTURE_VERSION);
    wp_enqueue_style('icon_font_ionic');

		/* store_picrure_admin_css */
    wp_register_style('store_picrure_admin_css', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/styles/backend/store-picture-admin.css', false, STOREPICTURE_VERSION);
    wp_enqueue_style('store_picrure_admin_css');

		/* anime */
		wp_register_script('anime', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/anime.min.js', array('jquery'), STOREPICTURE_VERSION, true);
    wp_enqueue_script('anime');

		/* sp modal */
		wp_register_script('store-picture-modal', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/jquery.store-picture-modal.js', array('jquery'), STOREPICTURE_VERSION, true);
    wp_enqueue_script('store-picture-modal');

		$current_post = StorePictureHelper::get_current_post_type();
		if('store-picture' !== $current_post) return;

		/* vue */
		wp_register_script('vue', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/vue.js', array(), '2.4.2', true);
    wp_enqueue_script('vue');

		/* vue element ui */
		wp_register_style('vueElementUi', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/element-ui.css', false, STOREPICTURE_VERSION);
    wp_enqueue_style('vueElementUi');
		wp_register_script('vueElementUi', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/element-ui.js', array('vue'), false, STOREPICTURE_VERSION);
    wp_enqueue_script('vueElementUi');
		wp_register_script('vueElementUi_en', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/en.js', array('vueElementUi'), false, STOREPICTURE_VERSION);
    wp_enqueue_script('vueElementUi_en');

		/* vue medium editor */
		wp_register_style('vueMediumEditor', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/medium-editor.min.css', false, STOREPICTURE_VERSION);
    wp_enqueue_style('vueMediumEditor');
		wp_register_script('vueMediumEditor', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/vueMediumEditor.min.js', array('vue'), false, STOREPICTURE_VERSION);
    wp_enqueue_script('vueMediumEditor');

    /* vue custom masonry */
    wp_register_script('vueCustomMasonry', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/vue-custom-masonry.js', array('jquery', 'vue'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('vueCustomMasonry');

		/* vue carousel 3d */
    wp_register_script('vue-carousel-3d', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/vue-carousel-3d.min.js', array('vue'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('vue-carousel-3d');

		/* ui-kit */
		wp_register_style('uikit', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/uikit/css/uikit.css', false, '3.0.0');
    wp_enqueue_style('uikit');
		wp_register_script('uikit', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/uikit/js/uikit.min.js', array('jquery'), '3.0.0', true);
    wp_enqueue_script('uikit');
		wp_register_script('uikit-icons', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/uikit/js/uikit-icons.min.js', array('jquery'), '3.0.0', true);
    wp_enqueue_script('uikit-icons');

    wp_register_style('nanoscroller', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/nanoscroller/nanoscroller.css', false, STOREPICTURE_VERSION);
    wp_enqueue_style('nanoscroller');
    wp_register_script('nanoscroller', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/nanoscroller/jquery.nanoscroller.min.js', array('jquery'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('nanoscroller');

		/* isotope */
		wp_register_script('isotope', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/isotope.pkgd.min.js', array(), '3.0.1', true);
		wp_enqueue_script('isotope');

		/* custom masonry */
		wp_register_script('store_picture_custom_masonry', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/jquery.custom-masonry.js', array('jquery', 'isotope'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('store_picture_custom_masonry');

		/* Sortable */
		wp_register_script('Sortable', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/Sortable.min.js', array('jquery'), '1.6.1', true);
		wp_enqueue_script('Sortable');

    /* Sp Request Tool */
    wp_register_script('sp_request', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/jquery.spRequest.js', array('jquery'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('sp_request');

    /* Small Confirm Tool */
    wp_register_script('small_confirm_tool', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/jquery.smallConfirmTool.js', array('jquery'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('small_confirm_tool');

    /* Woo Search Tool */
    wp_register_script('woo_search_tool', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/jquery.wooSearchTool.js', array('jquery'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('woo_search_tool');

		/* Small Confirm Tool */
    wp_register_script('small_confirm_tool', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/jquery.smallConfirmTool.js', array('jquery'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('small_confirm_tool');

		/* vuePicturePoints */
		wp_register_script('vuePicturePoints', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/vuePicturePoints.js', array('jquery', 'vue'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('vuePicturePoints');

		/* vueInstagramMedia */
		wp_register_script('vueInstagramMedia', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/vueInstagramMedia.js', array('jquery', 'vue'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('vueInstagramMedia');

		/* vueStorepictureProductItem */
    wp_register_script('vueStorepictureProductItem', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/vueStorepictureProductItem.js', array('jquery', 'vue'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('vueStorepictureProductItem');

		/* vue Store Picture Modal Edit */
    wp_register_script('vueStorePictureModalEdit', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/vueElementLibs/vueStorePictureModalEdit.js', array('jquery', 'vue'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('vueStorePictureModalEdit');

		/* store_picture_admin */
		wp_register_script('store_picture_admin', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/jquery.store-picture-admin.js', array('jquery', 'store_picture_custom_masonry'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('store_picture_admin');

		/* store_picture_admin */
		wp_register_script('store_picture_settings', plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/jquery.store-picture-settings.js', array('jquery'), STOREPICTURE_VERSION, true);
		wp_enqueue_script('store_picture_settings');

		/* wp_localize_script */
		wp_localize_script( 'store_picture_admin', 'sp_object', array(
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'settings' => StorePictureHelper::get_settings(),
			'extends'	 => apply_filters('store_picture_extends_localize', array()),
			'language' => array(
				'wp_media_title' => __('Select or Upload Media Of Your Chosen Persuasion', 'store-picture'),
				'wp_media_button_text' => __('Use this media', 'store-picture'),
			),
		));

		/* wp_localize_script */
		$store_picture_settings = StorePictureHelper::get_settings();
		$form = array_merge(StorePictureHelper::default_settings(), $store_picture_settings);

		wp_localize_script( 'store_picture_settings', 'sp_settings_object', array(
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'form' => $form,
		));

		wp_enqueue_media();
	}

	function enqueue_mce_plugin_scripts($plugin_array) {
		echo '
		<script>
			var sp_enqueue_mce_obj = {
				ajax_url: "'. admin_url( 'admin-ajax.php' ) .'",
			};
		</script>';
		$plugin_array["add_store_picture_button"] =  plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . 'assets/javascripts/jquery.add-store-picture-button.js';
    return $plugin_array;
	}

	function register_buttons_editor($buttons) {

		//register buttons with their id.
    array_push($buttons, 'add_store_picture');
    return $buttons;
	}

  function hook_init() {
    $this->register_post_type();
  }

  function register_post_type() {
    $labels = array(
  		'name'               => __( 'Store Picture', 'store-picture' ),
  		'singular_name'      => __( 'Store Picture', 'store-picture' ),
  		'menu_name'          => __( 'Stores Picture', 'store-picture' ),
  		'name_admin_bar'     => __( 'Store Picture', 'store-picture' ),
  		'add_new'            => __( 'Add New', 'store-picture' ),
  		'add_new_item'       => __( 'Add New Store', 'store-picture' ),
  		'new_item'           => __( 'New Store', 'store-picture' ),
  		'edit_item'          => __( 'Edit Store', 'store-picture' ),
  		'view_item'          => __( 'View Store', 'store-picture' ),
  		'all_items'          => __( 'All Stores', 'store-picture' ),
  		'search_items'       => __( 'Search Stores', 'store-picture' ),
  		'parent_item_colon'  => __( 'Parent Stores:', 'store-picture' ),
  		'not_found'          => __( 'No stores found.', 'store-picture' ),
  		'not_found_in_trash' => __( 'No stores found in Trash.', 'store-picture' )
  	);

  	$args = array(
  		'labels'             => $labels,
      'description'        => __( 'Store Picture.', 'store-picture' ),
  		'public'             => true,
  		'publicly_queryable' => true,
  		'show_ui'            => true,
  		'show_in_menu'       => true,
  		'query_var'          => true,
  		'rewrite'            => array( 'slug' => 'store-picture' ),
  		'capability_type'    => 'post',
  		'has_archive'        => false,
  		'hierarchical'       => false,
  		'menu_position'      => null,
      'menu_icon'          => plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . '/assets/images/store-picrure-icon-60x60.png',
  		'supports'           => array( 'title' )
  	);

  	register_post_type( 'store-picture', $args );
		add_filter( 'manage_store-picture_posts_columns' , array($this, 'add_shortcode_column'), 10, 2 );
		add_action( 'manage_store-picture_posts_custom_column' , array($this, 'add_shortcode_custom_columns'), 10, 2 );
  }

	function plugin_options_menu() {

		//create new top-level menu
		add_submenu_page(
			'edit.php?post_type=store-picture',
			__('Store Picture Settings', 'store-picture'),
			__('Settings', 'store-picture'),
			'manage_options',
			'picture-store-settings',
			array($this, 'picture_store_settings_page_callback')
		);
	}

	function picture_store_settings_page_callback() {
		StorePictureHelper::load_template( STOREPICTURE_PLUGIN_TEMPLATES . 'admin/store-picture-settings.php', array(), true );
	}

	/* Add custom column to store picture shortcode */
	function add_shortcode_column( $columns ) {
    return array_merge( $columns, array( 'shortcode' => __( 'Shortcode', 'store-picture' ) ) );
	}

	function add_shortcode_custom_columns($column, $post_id) {
		switch ( $column ) {
			case 'shortcode':
				echo sprintf('[store-picture id="%s"]', $post_id);
				break;
		}
	}
}

new StorePictureAdmin();
