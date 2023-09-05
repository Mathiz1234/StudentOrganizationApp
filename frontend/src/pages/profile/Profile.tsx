import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import {
    IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader,
    IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonTitle,
    IonToolbar, useIonViewWillEnter
} from '@ionic/react';

import { ApiConstant } from '../../shared/constant/api.constants';
import { Store } from '../../shared/store';

const Profile: React.FC = () => {
    const [user, setUser] = useState<any>({});
    const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
    const [me, setMe] = useState<{role: string} | null>(null);
    const page = useRef(null);

    useEffect(() => {
        Store.getInstance().get('me').then((me) => setMe(me));
    }, []);

    useEffect(() => {
        setPresentingElement(page.current);
    }, []);

    useIonViewWillEnter(async () => {
        const user = await getUser();
        setUser(user);
    });

    const getUser = async () => {
      const me = await Store.getInstance().get('me');
      const {data} = await axios.get(ApiConstant.apiUrl + '/accounts/' + me.id,
      {
          headers: {
              Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
          }
      });
      return data;
    };

    const doRefresh = async (event: any) => {
      const data = await getUser();
      setUser(data);
      event.detail.complete();
    };

    return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Profil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(ev) => doRefresh(ev)}>
          <IonRefresherContent />
        </IonRefresher>

      <IonCard>
      <IonCardHeader>
        <IonCardTitle>Twoje podstawowe dane</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem>
            <IonLabel>Imię: {user.firstName}</IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Nazwisko: {user.lastName}</IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>E-mail: {user.email}</IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Status: {user.status}</IonLabel>
          </IonItem>

          <IonItem lines="none">
            <IonLabel>Rola: {user.role}</IonLabel>
          </IonItem>
        </IonList>
      </IonCardContent>
      </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Profile;
