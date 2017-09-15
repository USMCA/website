import 'babel-polyfill';
import * as $ from 'jquery';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Root from './components/root';

$(document).ready(() => {
  ReactDOM.render(
    <Root />,
    document.getElementById('root')
  );
});
