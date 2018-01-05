<?php

if(! function_exists('sp_frontend_filter_the_content')) :
  function sp_frontend_filter_the_content($content) {
    global $post;
    if ($post->post_type == 'store-picture') {
      $content = sprintf('[store-picture id="%s"]', $post->ID);
    }
    return $content;
  }
  add_filter('the_content', 'sp_frontend_filter_the_content');
endif;

if(! function_exists('sp_frontend_add_extra_meta_tags')) :
  function sp_frontend_add_extra_meta_tags() {
    global $post;
    if(! is_single() || get_post_type($post->ID) != 'store-picture') return;
    $url = $title = $description = $image = '';

    $url = get_permalink($post);
    $data = StorePictureHelper::get_store_picture_metabox_by_id($post->ID, 'ARRAY');
    $storePictureData = $data['storePictureData'];

    if(count($storePictureData) > 0) {
      $title = $storePictureData[0]['name'];
      $description = $storePictureData[0]['description'];
      $image = $storePictureData[0]['pictures']['url'];

      if(isset($_GET['sid']) && !empty($_GET['sid'])) {
        list($pid, $key) = explode('.', $_GET['sid']);

        $url = add_query_arg( array(
    	    'sid' => $_GET['sid'],
    		), get_permalink($post));

        $data = StorePictureHelper::search_picture_data_by_key($storePictureData, $key);
        if($data) {
          $title = $data['name'];
          $description = $data['description'];
          $image = $data['pictures']['url'];
        }
      }
    }

    $variables = array(
      '{{url}}'           => $url,
      '{{type}}'          => 'product',
      '{{title}}'         => get_the_title($post),
      '{{description}}'   => sprintf('%s - %s', strip_tags($title), strip_tags($description)),
      '{{image}}'         => $image,
    );

    $extra_metas = implode('
', array(
      /* facebook */
      '<meta property="og:url"                content="{{url}}" />',
      '<meta property="og:type"               content="{{type}}" />',
      '<meta property="og:title"              content="{{title}}" />',
      '<meta property="og:description"        content="{{description}}" />',
      '<meta property="og:image"              content="{{image}}" />',
      /* twitter */
      '<meta name="twitter:url"               content="{{url}}">',
      '<meta name="twitter:title"             content="{{title}}">',
      '<meta name="twitter:description"       content="{{description}}">',
      '<meta name="twitter:image:src"         content="{{image}}">',
    ));

    echo str_replace(array_keys($variables), array_values($variables), $extra_metas);
  }
  add_action( 'wp_head', 'sp_frontend_add_extra_meta_tags');
endif;
