import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import {
    IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonInput, IonItem, IonLabel,
    IonList, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonTitle,
    IonToolbar, useIonToast, useIonViewWillEnter
} from '@ionic/react';

import { ApiConstant } from '../../shared/constant/api.constants';
import { Store } from '../../shared/store';

const Details: React.FC = () => {
    const [user, setUser] = useState<any>({});
    const [showToast] = useIonToast();
    const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
    const [me, setMe] = useState<{role: string} | null>(null);
    const page = useRef(null);
    const form = useRef<HTMLFormElement>(null);

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

    const updateUser = async () => {
      const formData = new FormData(form.current!);
      const body:any = {};

      for (const [key, value] of formData) {
        if(key === 'studyYear' || key === 'studyGroup'){
          body[key] = Number(value) || null;
          continue;
        }
        body[key] = value || null;
      }

      const {status} = await axios.post(ApiConstant.apiUrl + '/accounts/' + user.id,
      body,
      {
          headers: {
              Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
          }
      });

      if(status === 204){
            showToast({
            message: 'Zmieniono!',
            duration: 1500,
            position: 'bottom',
            });
            const data = await getUser();
            setUser(data);
        } else {
            showToast({
            message: 'Coś poszło nie tak ;(',
            duration: 1500,
            position: 'bottom',
            });
        }
    }

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
        <IonCardTitle>Szczegóły</IonCardTitle>
        <IonCardSubtitle>(możłiwość edycji)</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>

      <form ref={form}>
      <IonList>
        <IonItem>
          <IonInput className="ion-text-right" name="nick" label="Nick:" placeholder="Brak" value={user.nick}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel>Urodziny: </IonLabel>
          <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
          <IonModal keepContentsMounted={true}>
            <IonDatetime name='birthday' presentation='date' id="datetime" value={user.birthday}></IonDatetime>
          </IonModal>
        </IonItem>
        <IonItem>
          <IonInput className="ion-text-right" name="address" label="Adres:" placeholder="Brak" value={user.address}></IonInput>
        </IonItem>
        <IonItem>
          <IonInput className="ion-text-right" name="city" label="Miasto:" placeholder="Brak" value={user.city}></IonInput>
        </IonItem>
        <IonItem>
          <IonInput className="ion-text-right" name="zipCode" label="Kod pocztowy:" placeholder="Brak" value={user.zipCode}></IonInput>
        </IonItem>
        <IonItem>
          <IonInput className="ion-text-right" name="phoneNumber" label="Telefon:" type="tel" placeholder="Brak" value={user.phoneNumber}></IonInput>
        </IonItem>
        <IonItem>
          <IonInput className="ion-text-right" name="joined" label="Dołączył:" placeholder="Brak" value={user.joined}></IonInput>
        </IonItem>
        <IonItem>
          <IonInput className="ion-text-right" name="faculty" label="Wydział:" placeholder="Brak" value={user.faculty}></IonInput>
        </IonItem>
        <IonItem>
          <IonInput className="ion-text-right" name="fieldOfStudy" label="Kierunek:" placeholder="Brak" value={user.fieldOfStudy}></IonInput>
        </IonItem>
        <IonItem>
          <IonInput className="ion-text-right" name="studyYear" label="Rok:" type="number" placeholder="Brak" value={user.studyYear}></IonInput>
        </IonItem>
        <IonItem>
          <IonInput className="ion-text-right" name="studyGroup" label="Grupa:" placeholder="Brak" value={user.studyGroup}></IonInput>
        </IonItem>
        <IonItem>
          <IonInput className="ion-text-right" name="tShirtSize" label="Rozmiar koszulki:" placeholder="Brak" value={user.tShirtSize}></IonInput>
        </IonItem>
      </IonList>
      </form>

      <IonGrid>
          <IonRow className="ion-align-items-center ion-justify-content-center">
              <IonButton onClick={updateUser} color="tertiary">ZAPISZ</IonButton>
          </IonRow>
      </IonGrid>


      </IonCardContent>
      </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Details;
