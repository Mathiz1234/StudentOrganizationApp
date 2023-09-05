import { flashlight, happy } from 'ionicons/icons';
import React from 'react';
import { Redirect, Route } from 'react-router';

import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';

import Calls from './Calls';
import Feedbacks from './Feedbacks';

const Tasklist: React.FC = () => {
  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="call" href="/app/tasklist/call">
          <IonIcon icon={happy} />
          <IonLabel>Calle</IonLabel>
        </IonTabButton>
        <IonTabButton tab="feedback" href="/app/tasklist/feedback">
          <IonIcon icon={flashlight} />
          <IonLabel>Feedbacki</IonLabel>
        </IonTabButton>
      </IonTabBar>

      <IonRouterOutlet>
        <Route path="/app/tasklist/call" component={Calls} />
        <Route path="/app/tasklist/feedback" component={Feedbacks} />

        <Route exact path="/app/tasklist">
          <Redirect to="/app/tasklist/call" />
        </Route>
      </IonRouterOutlet>
    </IonTabs>
  );
};

export default Tasklist;
