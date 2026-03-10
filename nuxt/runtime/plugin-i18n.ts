import { defineNuxtPlugin } from '#app';
import { setupFormsPlugin } from './setup';

export default defineNuxtPlugin({
  name: 'valiform',
  enforce: 'post',
  dependsOn: ['i18n:plugin'],
  setup: setupFormsPlugin
});
