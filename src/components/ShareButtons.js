import React from 'react';
import classNames from 'classnames';

const ShareButtons = ({className}) => (
  <div className={
    classNames({
      "xx-share": true,
      [className]: true
    })}
  >
    <div className="xx-share__title">
      Поделиться:
    </div>
    <ul className="xx-share__list">
      <li className="social social-vk">
        <a href="" title="Поделиться в VK" />
      </li>
      <li className="social social-fb">
        <a href="" title="Поделиться в Facebook" />
      </li>
      <li className="social social-od">
        <a href="" />
      </li>
      <li className="social social-tw">
        <a href="" title="Поделиться в Twitter" />
      </li>
    </ul>
  </div>
);

export default ShareButtons;
