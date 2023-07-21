import Application from 'dummy/app';
import config from 'dummy/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from '@eflexsystems/ember-mocha';

setApplication(Application.create(config.APP));

start();
