import './style';
import { IconStyle } from './assets/iconfont/iconfont'
import { GlobalStyle } from './style';

import routes from './routes';
import { renderRoutes } from 'react-router-config'
import { HashRouter } from 'react-router-dom'

import store from './store';
import { Provider } from 'react-redux'

import { Data } from './application/Singers/data';


function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        <Data>
          {renderRoutes(routes)}
        </Data>
      </HashRouter>
    </Provider>
  );
}

export default App;
