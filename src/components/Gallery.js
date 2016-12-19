import React from 'react';
import classNames from 'classnames';
import CheckIcon from '../components/CheckIcon';
import walkers from '../walkers.json';

class Gallery extends React.Component {
  render() {
    const {visible, share, metWalkers} = this.props;

    return (
      <div className={classNames({
        'xx-gallery': true,
        'xx-gallery--hidden': !visible
      })}>
        <div className="xx-gallery__count">
          {Object.keys(metWalkers).length}/{walkers.length}
        </div>

        <ul className="xx-gallery__container">
          {
            walkers.map((walker, index) => {
             const isOpened = Object.keys(metWalkers).find(item => item === walker.id);

             return (
               <li className="xx-gallery__item">
                 <div
                   key={index}
                   className={
                     classNames({
                       "xx-gallery-walker": true,
                       "xx-gallery-walker--opened": isOpened
                     })
                   }
                   onClick={isOpened ? share.bind(walker) : null}
                 >
                   <div className="xx-gallery-walker__frame">
                     <div
                       className={
                         classNames({
                           "xx-gallery-walker__portrait": true,
                           "xx-gallery-walker__portrait--opened": isOpened
                         })
                       }
                       style={{
                         backgroundImage: isOpened ? "url(https://s3.eu-central-1.amazonaws.com/arzamas-static/x/338-new-year-jhtUdfkkqdp4is/1241/images/walkers/tolstoi.png)" : null
                       }}
                     >
                       {
                         isOpened &&
                         <div className="xx-gallery-walker__check">
                           <CheckIcon />
                         </div>
                       }
                     </div>
                   </div>
                   {
                     isOpened &&
                     <div className="xx-gallery-walker__name">
                       {walker.name}
                     </div>
                   }
                 </div>
               </li>
             );
            })
          }
        </ul>
      </div>
    );
  }
}

export default Gallery;
