<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if(! class_exists('StorePictureScssHepler') && class_exists('scssc')) :

  class StorePictureScssHepler {
    function __construct() {
      add_action('init', array($this, 'init_hooks'));
    }

    function init_hooks() {
      if(STOREPICTURE_DEBUG != true) return;
      $this->backend();
      $this->frontend();
    }

    function backend() {
      $scss_import_path = plugin_dir_path( STOREPICTURE_PLUGIN_FILE ) . 'assets/scss/backend';
      $output_css_file = plugin_dir_path( STOREPICTURE_PLUGIN_FILE ) . 'assets/styles/backend/store-picture-admin.css';
      $this->scss_render($scss_import_path, $output_css_file);
    }

		function frontend() {
      $scss_import_path = plugin_dir_path( STOREPICTURE_PLUGIN_FILE ) . 'assets/scss/frontend';
      $output_css_file = plugin_dir_path( STOREPICTURE_PLUGIN_FILE ) . 'assets/styles/frontend/store-picture.css';
      $this->scss_render($scss_import_path, $output_css_file);
    }

    static public function scss_render($scss_import_path = null, $output_file = null, $main_file = 'main.scss') {
      $scss = new scssc();
			$scss->setFormatter("scss_formatter_compressed");
      $scss->setImportPaths($scss_import_path);

      // $content_scss = file_get_contents($scss_import_path . '/' . $main_file);
      $content_scss = apply_filters( 'store-picture-scss-hook', file_get_contents($scss_import_path . '/' . $main_file) );

			$settings = StorePictureHelper::get_settings();
			$variables = array(
				'$main_color		: '. $settings['main_color'],
				'$second_color	: '. $settings['second_color'],
			);

      $content_css = $scss->compile(implode('; ', array(
				implode('; ', $variables),
				$content_scss
			)));

      file_put_contents($output_file, $content_css);
    }
  }

  new StorePictureScssHepler();
endif;
