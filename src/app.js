import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import gameReducer from './reducers/gameReducer';
import App from './containers/App';

const store = createStore(combineReducers({
  game: gameReducer
}));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.querySelector('.app')
);
