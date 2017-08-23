import 'babel-polyfill';
import $ from 'jquery';

import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/root';

$(document).ready(() => {
  ReactDOM.render(
    <Root />,
    document.getElementById('root')
  );
});
