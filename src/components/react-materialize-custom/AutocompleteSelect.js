/*******************************************************************************
 *
 * AutocompleteSelect: Similar to Autocomplete, but associates a display with each
 * display, as in a select element.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import constants from './constants';
import { Col, Icon } from 'react-materialize';

class AutocompleteSelect extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: 'ailee',
      display: ''
    };

    this.renderIcon = this.renderIcon.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  renderIcon (icon, iconClassName) {
    return <Icon className={iconClassName}>{icon}</Icon>;
  }

  renderDropdown (data, minLength, limit) {
    const { display } = this.state;

    if (minLength && minLength > display.length || !display) {
      return null;
    }

    const matches = Object.keys(data).filter((key, idx) => {
      const index = key.toUpperCase().indexOf(display.toUpperCase());
      return (index !== -1 && display.length < key.length);
    }).slice(0, limit);

    return (
      <div>
        <ul className='autocomplete-content dropdown-content'>
          {matches.map((key, idx) => {
            const index = key.toUpperCase().indexOf(display.toUpperCase());
            return (
              <li 
                key={key + '_' + idx} 
                onClick={(evt) => { 
                  this.setState({ display: key }); 
                  if (this.props.onChange) this.props.onChange(data[key]);
                }}>
                <span>
                  {index !== 0 ? key.substring(0, index) : ''}
                  <span className='highlight'>{display}</span>
                  {key.length !== index + display.length ? key.substring(index + display.length) : ''}
                </span>
              </li>
            );
          })}
        </ul>
        <br />
      </div>
    );
  }

  _onChange (evt) {
    this.setState({ display: evt.target.value });
  }

  render () {
    const {
      className,
      title,
      data,
      icon,
      iconClassName,
      s,
      m,
      l,
      offset,
      minLength,
      limit,
      placeholder,
      ...props
    } = this.props;

    const _id = 'autocomplete-input';
    const sizes = { s, m, l };
    let classes = { col: true };
    constants.SIZES.forEach(size => {
      classes[size + sizes[size]] = sizes[size];
    });

    return (
      <Col offset={offset} className={cx('input-field', className, classes)} {...props}>
        {icon && this.renderIcon(icon, iconClassName)}
        <input
          className='autocomplete'
          placeholder={ placeholder }
          id={_id}
          onChange={this._onChange}
          type='text'
          value={this.state.display}
        />
        <label htmlFor={_id}>{title}</label>
        {this.renderDropdown(data, minLength, limit)}
      </Col>
    );
  }
}

AutocompleteSelect.propTypes = {
  className: PropTypes.string,
  /*
   * The title of the autocomplete component.
   */
  title: PropTypes.string,
  /*
   * An object with the keys of the items to match in autocomplete
   * The values are either null or a location to an image
   */
  data: PropTypes.object.isRequired,
  /*
   * Optional materialize icon to add to the autocomplete bar
   */
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  s: PropTypes.number,
  m: PropTypes.number,
  l: PropTypes.number,
  offset: PropTypes.string,
  /*
   * Determine input length before dropdown
   */
  minLength: PropTypes.number
};

export default AutocompleteSelect;
