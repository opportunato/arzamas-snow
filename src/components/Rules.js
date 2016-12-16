import React from 'react';
import classNames from 'classnames';

const Rules = ({ onClick, visible }) => (
  <div className={classNames({
    'xx-rules': true,
    'xx-visible': visible,
    'xx-hidden': !visible
  })}>
    <a href="" className="xx-chapter">Арзамас. Новый год</a>
    <div className="xx-title">Симулятор путника, выходящего из леса</div>
    <div
      className="xx-lead"
      dangerouslySetInnerHTML={{__html: "Ничего умнее мы не придумали. Вам надо дико медитировать — вдруг кто-нибудь выйдет из леса? А вдруг никто не выйдет? Главное — терпеливо ждать и не отвлекаться" }}
    />
    <button className="xx-btn xx-btn--big" onClick={onClick}>Поехали</button>
  </div>
);

Rules.propTypes = {
  onClick: React.PropTypes.func.isRequired,
};

export default Rules;
