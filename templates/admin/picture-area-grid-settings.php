<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

?>
<div class="sp-fields-wrap">
  <fieldset class="uk-fieldset sp-custom-fieldset">
    <legend class="uk-legend">Grid Options</legend>
    <div class="" uk-grid>
      <div class="uk-width-1-2@m">
        <div class="uk-margin sp-field-wrap">
          <label class="sp-field-label">Grid Column <span class="sp-field-val">{{ storePicture.generalSettings.gridOptions.col }}</span></label>
          <el-slider
            v-model="storePicture.generalSettings.gridOptions.col"
            :step="1"
            :min="1"
            :max="12"
            show-stops>
          </el-slider>
        </div>

        <div class="uk-margin sp-field-wrap">
          <label class="sp-field-label">Gap <span class="sp-field-val">{{ storePicture.generalSettings.gridOptions.space }}px</span></label>
          <el-slider
            v-model="storePicture.generalSettings.gridOptions.space"
            :min="0"
            :max="45">
          </el-slider>
        </div>
      </div>
      <div class="uk-width-1-2@m">
        <div class="uk-margin sp-field-wrap">
          <label class="sp-field-label">Grid Column Tablet (responsive) <span class="sp-field-val">{{ storePicture.generalSettings.gridOptions.responsives.tablet.col }}</span></label>
          <el-slider
            v-model="storePicture.generalSettings.gridOptions.responsives.tablet.col"
            :step="1"
            :min="1"
            :max="storePicture.generalSettings.gridOptions.col"
            show-stops>
          </el-slider>
        </div>

        <div class="uk-margin sp-field-wrap">
          <label class="sp-field-label">Grid Column Mobi (responsive) <span class="sp-field-val">{{ storePicture.generalSettings.gridOptions.responsives.mobi.col }}</span></label>
          <el-slider
            v-model="storePicture.generalSettings.gridOptions.responsives.mobi.col"
            :step="1"
            :min="1"
            :max="storePicture.generalSettings.gridOptions.col"
            show-stops>
          </el-slider>
        </div>
      </div>
    </div>
  </fieldset>
  <div class="grid-preview">
    <div class="uk-margin">
      <sp-custom-masonry v-if="storePicture.storePictureData.length > 0"></sp-custom-masonry>
    </div>
  </div>
</div>
