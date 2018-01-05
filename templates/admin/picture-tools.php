<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<div class="boundary uk-width-1-1@s">
    <button class="uk-button uk-button-default uk-button-sp btn-tool-item" type="button"><?php _e('Add Picture', 'store-picture') ?></button>
    <div uk-dropdown="boundary: .boundary">
			<sp-tools>
				<sp-add-picture type="wp-media"><?php _e('Media', 'store-picture') ?></sp-add-picture>
				<sp-add-picture v-if="settings.instagram_access_token && settings.instagram_access_token.access_token" type="instagram" href="#modal-instagram-container"><?php _e('Instagram', 'store-picture') ?></sp-add-picture>
			</sp-tools>
    </div>
</div>
