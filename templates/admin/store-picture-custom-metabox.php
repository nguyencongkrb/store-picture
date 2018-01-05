<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
// echo StorePictureInstagramHelper::validateParams();
global $post;
?>
<div id="store-picture-custom-metabox-wrap" data-post-id="<?php echo esc_attr($post->ID); ?>">
	<a href="#" class="sp-banner-wrap"><img style="width: 80%;" src="<?php echo esc_attr(plugin_dir_url( STOREPICTURE_PLUGIN_FILE ) . '/assets/images/store-picture-banner-x1.jpg'); ?>" alt="#"></a>

	<ul class="uk-flex-center" uk-tab="connect: #store-picture-main-tabs; animation: uk-animation-fade;">
    <li><a href="#"><?php _e('Pictures', 'store-picture'); ?> <span class="sp-badge" v-if="storePicture.storePictureData.length > 0">{{ storePicture.storePictureData.length }}</span></a></li>
    <li :class="classNavTabControl()"><a href="#"><?php _e('Grid Layout Settings', 'store-picture'); ?></a></li>
    <!-- <li :class="classNavTabControl()"><a href="#"><?php _e('Carousel Layout Settings', 'store-picture'); ?></a></li> -->
	</ul>
	<ul id="store-picture-main-tabs" class="uk-switcher uk-margin sp-custom-switcher">
    <li>
			<div class="sp-tab-container">
				<div class="sp-tools">
					<div class="">
						<?php StorePictureHelper::load_template(STOREPICTURE_PLUGIN_TEMPLATES . 'admin/picture-tools.php', array('post' => $post), true); ?>
					</div>
				</div>
			  <div class="sp-area-design">
					<div class="">
				    <?php StorePictureHelper::load_template(STOREPICTURE_PLUGIN_TEMPLATES . 'admin/picture-table.php', array('post' => $post), true); ?>
					</div>
				</div>
			</div>
    </li>
    <li>
			<div class="sp-grid-settings-wrap sp-tab-container">
				<div class="">
					<?php StorePictureHelper::load_template(STOREPICTURE_PLUGIN_TEMPLATES . 'admin/picture-area-grid-settings.php', array('post' => $post), true); ?>
				</div>
			</div>
		</li>
    <li>
			<div class="sp-grid-settings-wrap sp-tab-container">
				<div class="">
					<?php echo apply_filters( 'store-picture-area-slide-settings', 'Coming Soon!, back to <a href="#" uk-tab-item="previous">'. __('Grid Layout Settings', 'store-picture') .'</a>', $post ); ?>
				</div>
			</div>
		</li>
	</ul>

	<!-- picture-edit modal -->
	<sp-picture-edit v-if="modalControl.show" @close="modalControl.show = false" edit="true"></sp-picture-edit>
	<!-- instagram modal -->
	<sp-instagram-media-modal modal-id="modal-instagram-container" modal-title="<?php _e('Instagram Media', 'store-picture'); ?>" modal-button-text="<?php _e('Use this media', 'store-picture'); ?>"></sp-instagram-media-modal>
	<!-- hidden field -->
  <textarea class="uk-hidden" name="_store_picture_data" v-model="storePictureDataStringify"></textarea>
</div>
