import { analytics, cut, person, star } from 'ionicons/icons';
import { Redirect, Route } from 'react-router';

import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';

import Details from './Details';
import Functions from './Functions';
import Profile from './Profile';
import Trainings from './Trainings';

function ProfileTabs () {
    return (
    <IonTabs>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/app/profile/tab1">
            <IonIcon icon={person} />
            <IonLabel>Dane</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/app/profile/tab2">
            <IonIcon icon={cut} />
            <IonLabel>Szczegóły</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/app/profile/tab3">
            <IonIcon icon={star} />
            <IonLabel>Funkcje</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab4" href="/app/profile/tab4">
            <IonIcon icon={analytics} />
            <IonLabel>Treningi</IonLabel>
          </IonTabButton>
        </IonTabBar>

      <IonRouterOutlet>
        <Route path="/app/profile/tab1" component={Profile} />
        <Route path="/app/profile/tab2" component={Details} />
        <Route path="/app/profile/tab3" component={Functions} />
        <Route path="/app/profile/tab4" component={Trainings} />
        <Route exact path="/app/profile">
          <Redirect to="/app/profile/tab1" />
        </Route>
      </IonRouterOutlet>
    </IonTabs>
    )
}

export default ProfileTabs;
