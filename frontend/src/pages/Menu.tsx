import {
    analytics, bookmarks, colorWand, homeOutline, logOut, logOutOutline, people, person, planet,
    star
} from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router';

import {
    IonButton, IonContent, IonHeader, IonIcon, IonItem, IonMenu, IonMenuToggle, IonPage,
    IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar
} from '@ionic/react';

import { Store } from '../shared/store';
import Birthdays from './birthdays/Birthdays';
import List from './list/List';
import ProfileTabs from './profile/ProfileTabs';
import Projects from './projects/Projects';
import Tasklist from './tasklist/Tasklist';
import Trainings from './trainings/Trainings';

const Menu: React.FC = () => {
  const paths = [
    { name: 'Członkowie', url: '/app/list', icon: people, onlyForManagement: false },
    { name: 'Urodziny', url: '/app/birthdays', icon: colorWand, onlyForManagement: false  },
    { name: 'Tasklista', url: '/app/tasklist', icon: bookmarks, onlyForManagement: false  },
    { name: 'Mój profil', url: '/app/profile', icon: person, onlyForManagement: false  },
    { name: 'Projekty i funkcje', url: '/app/projects', icon: planet, onlyForManagement: true  },
    { name: 'Dodatkowe aktywności', url: '/app/trainings', icon: analytics, onlyForManagement: true  },
  ];

  const [me, setMe] = useState({});
  useEffect(() => {
      Store.getInstance().get('me').then((me) => setMe(me));
  }, []);

  const logOut = async () => {
    await Store.getInstance().remove('access_token');
    await Store.getInstance().remove('me');
  }

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar color={'primary'}>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {paths.map((item, index) => (
              //@ts-ignore
              (!item.onlyForManagement || me.role !== 'USER') &&
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem detail={true} routerLink={item.url} routerDirection="none">
                  <IonIcon slot="start" icon={item.icon} />
                  {item.name}
                </IonItem>
              </IonMenuToggle>
            ))}

            <IonMenuToggle autoHide={false}>
              <IonButton onClick={logOut} color="tertiary" expand="full" routerLink="/" routerDirection="root">
                <IonIcon slot="start" icon={logOutOutline} />
                Logout
              </IonButton>
            </IonMenuToggle>
          </IonContent>
        </IonMenu>

        <IonRouterOutlet id="main">
          <Route exact path="/app/list" component={List} />
          <Route path="/app/birthdays" component={Birthdays} />
          <Route path="/app/tasklist" component={Tasklist} />
          <Route path="/app/profile" component={ProfileTabs} />
          <Route path="/app/projects" component={Projects} />
          <Route path="/app/trainings" component={Trainings} />
          <Route exact path="/app">
            <Redirect to="/app/list" />
          </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default Menu;
