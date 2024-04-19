import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './Components/Header';
import DynamicSnackbar from './Components/DynamicSnackbar';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <DynamicSnackbar />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
