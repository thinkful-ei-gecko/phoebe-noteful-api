'use strict';

//tells the server to run the submitted times in UTC. Overriden by Windows; must reset your clock on your system, but good to have for Herkou/Mac/other envs that would respect this
process.env.TZ = 'UTC';
require('dotenv').config();
const { expect } = require('chai');
const supertest = require('supertest');

//after getting the values for these items used in testing, set them to the global object for use
global.expect = expect;
global.supertest = supertest;