import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import constants from './constants';
import { Col, Icon } from 'react-materialize';

class Autocomplete extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      value: props.defaultValue || props.value || ''
    };

    this.renderIcon = this.renderIcon.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  renderIcon (icon, iconClassName) {
    return <Icon className={iconClassName}>{icon}</Icon>;
  }

  renderDropdown (data, minLength, limit) {
    const { value } = this.state;

    if (minLength && minLength > value.length || !value) {
      return null;
    }

    const matches = Object.keys(data).filter((key, idx) => {
      const index = key.toUpperCase().indexOf(value.toUpperCase());
      return (index !== -1 && value.length < key.length);
    }).slice(0, limit);

    return (
      <div>
        <ul className='autocomplete-content dropdown-content'>
          {matches.map((key, idx) => {
            const index = key.toUpperCase().indexOf(value.toUpperCase());
            return (
              <li key={key + '_' + idx} onClick={(evt) => { this.setState({ value: key }); this.props.onChange(key); }}>
                {data[key] ? <img src={data[key]} className='right circle' /> : null}
                <span>
                  {index !== 0 ? key.substring(0, index) : ''}
                  <span className='highlight'>{value}</span>
                  {key.length !== index + value.length ? key.substring(index + value.length) : ''}
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
    const { onChange } = this.props;
    if (onChange) onChange(evt, evt.target.value);
    this.setState({ value: evt.target.value });
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
      onChange,
      disabled,
      ...props
    } = this.props;

    const _id = 'autocomplete-input';
    const sizes = { s, m, l };
    let classes = { col: true };
    constants.SIZES.forEach(size => {
      classes[size + sizes[size]] = sizes[size];
    });

    let labelClasses = {
      active: this.state.value
    };

    return (
      <Col offset={offset} className={cx('input-field', className, classes)} {...props}>
        {icon && this.renderIcon(icon, iconClassName)}
        <input
          className='autocomplete'
          placeholder={ placeholder }
          id={_id}
          onChange={this._onChange}
          type='text'
          value={this.state.value}
          disabled={ disabled }
        />
        <label className={cx(labelClasses)} htmlFor={_id}>{title}</label>
        {this.renderDropdown(data, minLength, limit)}
      </Col>
    );
  }
}

Autocomplete.propTypes = {
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

export default Autocomplete;
