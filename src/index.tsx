// React
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Redux
import configureStore, { history } from './redux/store';
import { ConnectedRouter } from 'connected-react-router';

// Providers
import { ConfigProvider } from 'antd';
import { Provider as ReduxProvider } from 'react-redux';
import enUS from 'antd/lib/locale-provider/en_US';

import DecentralizedSurvey from './views/DecentralizedSurvey';

const reduxStore = configureStore();

ReactDOM.render(
  <ConfigProvider locale={enUS}>
    <ReduxProvider store={reduxStore}>
      <ConnectedRouter history={history}>
        <DecentralizedSurvey />
      </ConnectedRouter>
    </ReduxProvider>
  </ConfigProvider>,
  document.getElementById('root')
);
