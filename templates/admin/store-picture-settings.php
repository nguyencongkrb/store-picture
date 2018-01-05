<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
use MetzWeb\Instagram\Instagram;
?>
<div class="wrap">
  <h1><?php _e( 'Store Picture Settings', 'store-picture' ); ?></h1>
  <div id="store-picture-settings-wrap" class="store-picture-settings-wrap">
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="grid-conten bg-purple ">
          <el-form v-loading="loading" element-loading-text="Loading..." ref="form" label-position="left" :model="form" label-width="200px">
            <ul class="uk-flex-left" uk-tab>
                <li class="uk-active"><a href="#"><?php _e( 'General', 'store-picture' ); ?></a></li>
                <li><a href="#"><?php _e( 'Instagram API', 'store-picture' ); ?></a></a></li>
                <li class="uk-disabled"><a href="#"><?php _e( 'Firebase API', 'store-picture' ); ?></a></li>
            </ul>
            <ul class="uk-switcher uk-margin sp-custom-switcher">
              <!-- general -->
              <li class="general-settings-wrap">
                <div class="uk-switcher-container">
                  <el-form-item label="<?php _e('Main Color', 'store-picture'); ?>">
                    <el-color-picker v-model="form.main_color" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="<?php _e('Second Color', 'store-picture'); ?>">
                    <el-color-picker v-model="form.second_color" show-alpha></el-color-picker>
                  </el-form-item>
                </div>
              </li>
              <!-- instagram -->
              <li class="instagram-settings-wrap">
                <div class="uk-switcher-container">
									<div v-if="! form.instagram_access_token.access_token">
	                  <el-form-item label="<?php _e('Client ID', 'store-picture'); ?>">
	                    <el-input v-model="form.instagram_client_id"></el-input>
	                  </el-form-item>
	                  <el-form-item label="<?php _e('Client Secret', 'store-picture'); ?>">
	                    <el-input v-model="form.instagram_client_secret"></el-input>
	                  </el-form-item>
									</div>
									<div v-else>
										<el-form-item label="<?php _e('Access Token', 'store-picture'); ?>">
											<div class="sp-instagram-access-token-ui">
												<img class="ava" :src="form.instagram_access_token.user.profile_picture" alt="#">
												<div class="info">
													<div class="name">{{ form.instagram_access_token.user.username }} ({{ form.instagram_access_token.user.id }})</div>
													<div class="token-text">{{ instagram_token_code }}</div>
												</div>
											</div>
										</el-form-item>
									</div>
									<el-form-item>
                    <el-button :type="instagram_auth_type" :disabled="instagram_auth" :loading="instagram_auth_loading" @click="instagram_auth_handle"><?php _e('Authenticate', 'store-picture') ?></el-button>
                    <el-button v-if="form.instagram_access_token.access_token" type="danger" @click="instagram_remove_token_handle"><?php _e('Remove Token', 'store-picture') ?></el-button>
                  </el-form-item>
                  <p>Note: Login to Instagram (if you haven't already) and go to <a href="http://instagram.com/developer" target="_blank">http://instagram.com/developer</a>. Click on "Manage Clients" in top right corner. Enter data in form as shown below (instead of example.com , put actual URL of your site). Click on "Register" and copy your "Client ID" and "Client Secret"</p>
                </div>
              </li>
							<!-- firebase -->
              <li class="firebase-settings-wrap">
                <div class="uk-switcher-container">
                  <el-form-item label="<?php _e('apiKey', 'store-picture'); ?>">
                    <el-input v-model="form.firebase_api_key"></el-input>
                  </el-form-item>
                  <el-form-item label="<?php _e('authDomain', 'store-picture'); ?>">
                    <el-input v-model="form.firebase_auth_domain"></el-input>
                  </el-form-item>
                  <el-form-item label="<?php _e('databaseURL', 'store-picture'); ?>">
                    <el-input v-model="form.firebase_database_url"></el-input>
                  </el-form-item>
                  <el-form-item label="<?php _e('projectId', 'store-picture'); ?>">
                    <el-input v-model="form.firebase_project_id"></el-input>
                  </el-form-item>
                  <el-form-item label="<?php _e('storageBucket', 'store-picture'); ?>">
                    <el-input v-model="form.firebase_storageBucket"></el-input>
                  </el-form-item>
                  <el-form-item label="<?php _e('messagingSenderId', 'store-picture'); ?>">
                    <el-input v-model="form.firebase_messaging_sender_id"></el-input>
                  </el-form-item>
                  <p>Note: Go to <a href="https://console.firebase.google.com/" target="_blank">Firebase Console</a> -> add new or select your Project -> click on Settings icon and select Project Settings and click in "add firebase in your web app" (the red circle icon) this action show you a dialog with: apiKey, authDomain, databaseURL, storageBucket, messagingSenderId.</p>
                </div>
              </li>
            </ul>
            <hr />
            <br />
            <div class="uk-text-right" uk-margin>
              <el-button type="primary" @click="onSubmit"><?php _e('Save', 'store-picture') ?></el-button>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple">
					<!-- <pre>{{ form }}</pre> -->
        </div>
      </el-col>
    </el-row>
  </div>
</div>
