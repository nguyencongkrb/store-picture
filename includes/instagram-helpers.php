<?php
if ( ! defined( 'ABSPATH' ) ) { exit; /* Exit if accessed directly. */ }

if(! class_exists('StorePictureInstagramHelper') ) :
  class StorePictureInstagramHelper {
    var $instagram, $apiKey, $apiSecret, $apiCallback, $scope, $access_token, $settings;

    function __construct() {
      $settings = $this->validateParams();
      if($settings == false) return; 

      $this->settings = $settings;

      $this->apiKey       = $this->settings['instagram_client_id'];
      $this->apiSecret    = $this->settings['instagram_client_secret'];
      $this->apiCallback  = get_site_url();
      $this->scope        = array('public_content', 'basic', 'likes');
      $this->access_token = (object) $this->settings['instagram_access_token'];

      $this->instagramInit();
    }

    public static function validateParams() {
      $settings = StorePictureHelper::get_settings();

      if
      (
        empty($settings['instagram_client_id']) ||
        empty($settings['instagram_client_secret']) ||
        empty($settings['instagram_access_token'])
      )
        return false;
      else
        return $settings;
    }

    function instagramInit() {
      $this->instagram = new Andreyco\Instagram\Client(array(
        'apiKey' 			=> $this->apiKey,
        'apiSecret' 	=> $this->apiSecret,
        'apiCallback' => $this->apiCallback, // must point to success.php
        'scope'       => $this->scope,
      ));

      $this->setAccessToken();
    }

    function setAccessToken() {
      $this->instagram->setAccessToken($this->access_token);
    }

    function getUserMedia() {
      return $this->instagram->getUserMedia();
    }

    function searchUser($name) {
      return $this->instagram->searchUser($name);
    }
  }
endif;
