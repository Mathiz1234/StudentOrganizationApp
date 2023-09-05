import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import {
    IonAvatar, IonButtons, IonCard, IonCardContent, IonChip, IonContent, IonHeader, IonItem,
    IonLabel, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonSkeletonText, IonTitle,
    IonToolbar, useIonViewWillEnter
} from '@ionic/react';

import { ApiConstant } from '../../shared/constant/api.constants';
import { Store } from '../../shared/store';

const Birthdays: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [birthdays, setBirthdays] = useState<any[]>([]);
    const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
    const page = useRef(null);

    useEffect(() => {
        setPresentingElement(page.current);
    }, []);

    useIonViewWillEnter(async () => {
        const users = await getBirthdays();
        setBirthdays(users);
        setLoading(false);
    });

    const getBirthdays = async () => {
      const {data} = await axios.get(ApiConstant.apiUrl + '/accounts/birtday-counts',
      {
          headers: {
              Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
          }
      });
      return data;
    };

    const doRefresh = async (event: any) => {
      const data = await getBirthdays();
      setBirthdays(data);
      event.detail.complete();
    };

    return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Urodziny</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(ev) => doRefresh(ev)}>
          <IonRefresherContent />
        </IonRefresher>

        {loading &&
          [...Array(10)].map((_, index) => (
            <IonCard key={index}>
              <IonCardContent className="ion-no-padding">
                <IonItem lines="none">
                  <IonAvatar slot="start">
                    <IonSkeletonText />
                  </IonAvatar>
                  <IonLabel>
                    <IonSkeletonText animated style={{ width: '150px' }} />
                    <p>
                      <IonSkeletonText />
                    </p>
                  </IonLabel>
                  <IonChip slot="end" color={'primary'}></IonChip>
                </IonItem>
              </IonCardContent>
            </IonCard>
          ))}

        {birthdays.map((birthday, index) => (
          birthday &&
          <IonCard key={index}>
            <IonCardContent className="ion-no-padding">
              <IonItem lines="none">
                <IonLabel>
                  {birthday.firstName} {birthday.lastName}
                  <p>{birthday.birthday}</p>
                </IonLabel>
                <IonChip color="tertiary" slot="end">
                  {birthday.birthdayCount}
                </IonChip>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}

      </IonContent>
    </IonPage>
  );
};

export default Birthdays;
