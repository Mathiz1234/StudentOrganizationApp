/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';

import { ellipse, square, triangle } from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';

import {
    IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Login from './pages/login/Login';
import Menu from './pages/Menu';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <GoogleOAuthProvider clientId='468820903493-e9qg17h5c2721atk8488igk71ioq5smm.apps.googleusercontent.com'>
      <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            <Login />
          </Route>
          <Route component={Menu} path="/app" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
    </GoogleOAuthProvider>
  </IonApp>
);

export default App;
