import './css/site.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './configureStore';
import { ApplicationState } from './store';
import { actionCreators as xsrfActionCreatores } from './store/Xsrf';
import * as SignalRModule from './store/SignalRConnection';
import * as RoutesModule from './routes';
import ConnectionContainer from './containers/ConnectionContainer';
let routes = RoutesModule.routes;

// Get the application-wide store instance, prepopulating with state from the server where available.
// Create browser history to use in the Redux store
// const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
const history = createBrowserHistory();

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as ApplicationState;
const store = configureStore(history, initialState);

// initialize session and xsrf clientside
// const sessionId = Cookies.get("SESSION") || guid();
// Initialize the xsrf token
// store.dispatch(xsrfActionCreatores.update());

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing configuration
    // and injects the app into a DOM element.
    ReactDOM.hydrate(
        <AppContainer>
            <Provider store={ store }>
                <ConnectionContainer>
                    <ConnectedRouter history={history} children={routes} />
                </ConnectionContainer>
            </Provider>
        </AppContainer>,
        document.getElementById('react-app')
    );
}

renderApp();

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require<typeof RoutesModule>('./routes').routes;
        renderApp();
    });
    // module.hot.accept('./store/SignalRConnection', () => {
    //     store.dispatch(SignalRModule.actionCreators.stopListener());
    //     const nextSignalRModule = require<typeof SignalRModule>('./store/SignalRConnection');
    //     store.dispatch(nextSignalRModule.actionCreators.startListener()); 
    // });
}