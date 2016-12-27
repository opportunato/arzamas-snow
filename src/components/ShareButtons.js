import React from 'react';
import classNames from 'classnames';

class ShareButtons extends React.Component {

  onShareClick = (e, {title, url}) => {
    e.preventDefault();
    const width = 500;
    const height = 600;
    const left = screen.width / 2 - (width / 2);
    const top = screen.height / 2 - (height / 2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
  };

  render() {
    const { className="", shareLink, text, imgId } = this.props;
    const title = encodeURIComponent(text);
    const shareParams = encodeURIComponent(`${shareLink}?title=${title}&pic=1200/shares/${imgId}.jpg`);

    const shareButtons = [
      {
        id: 'vk',
        title: 'Поделиться в VK',
        url: `https://vk.com/share.php?url=${shareParams}`
      },
      {
        id: 'fb',
        title: 'Поделиться в Facebook',
        url: `https://www.facebook.com/sharer/sharer.php?u=${shareParams}`
      },
      {
        id: 'od',
        title: 'Поделиться в Одноклассниках',
        url: `http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${shareParams}`
      },
      {
        id: 'tw',
        title: 'Поделиться в Twitter',
        url: `https://twitter.com/intent/tweet?text=${text}&original_referer=${shareLink}&url=${shareLink}`
      }
    ];

    return (
      <div className={
        classNames({
          "xx-share": true,
          [className]: true
        })
      }>
        <div className="xx-share__title">
          Поделиться в соцсети:
        </div>
        <ul className="xx-share__list">
          {
            shareButtons.map(({id, title, url}) => (
              <li key={id} className={`social social-${id}`}>
                <a
                  href = {url}
                  title = {title}
                  onClick = {(e) => this.onShareClick(e, {title, url})}
                />
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default ShareButtons;
