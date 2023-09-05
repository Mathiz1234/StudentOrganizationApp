import axios from 'axios';
import { add, create, trash } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';

import {
    IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip,
    IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton,
    IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSkeletonText, IonTitle,
    IonToolbar, useIonAlert, useIonToast, useIonViewWillEnter
} from '@ionic/react';

import { ApiConstant } from '../../shared/constant/api.constants';
import { Store } from '../../shared/store';

const Trainings: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [trainings, setTrainings] = useState<any[]>([]);
    const [showAlert] = useIonAlert();
    const [showToast] = useIonToast();
    const page = useRef(null);
    const addTrainingModal = useRef<HTMLIonModalElement>(null);
    const addTrainingInput = useRef<HTMLIonInputElement>(null);

    useIonViewWillEnter(async () => {
        const trainings = await getTrainings();
        setTrainings(trainings);
        setLoading(false);
    });

    const getTrainings = async () => {
      const {data} = await axios.get(ApiConstant.apiUrl + '/trainings',
      {
          headers: {
              Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
          }
      });
      return data;
    };

    const refreshTrainings = async () => {
      const data = await getTrainings();
      setTrainings(data);
    }

    const doRefresh = async (event: any) => {
      await refreshTrainings();
      event.detail.complete();
    };

    const addTraining = async () => {
        const {status} = await axios.post(ApiConstant.apiUrl + `/trainings`,
        {
            name: addTrainingInput.current?.value,
        },{
          headers: {
            Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
        }});
        if(status === 204){
            showToast({
              message: 'Dodano!',
              duration: 1500,
              position: 'bottom',
            });
            refreshTrainings();
            addTrainingModal.current?.dismiss()
        } else {
            showToast({
              message: 'Coś poszło nie tak ;(',
              duration: 1500,
              position: 'bottom',
            });
        }
    }

    const editTraining  = async (e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, trainingId: string) => {
      const target = e.target as HTMLElement;
      const input = [...target.parentElement!.children][0] as HTMLInputElement;
      const {status} = await axios.post(ApiConstant.apiUrl + `/trainings/${trainingId}`,
        {
            name: input.value,
        },{
          headers: {
            Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
        }});
        if(status === 204){
            showToast({
              message: 'Zmieniono!',
              duration: 1500,
              position: 'bottom',
            });
            refreshTrainings();
        } else {
            showToast({
              message: 'Coś poszło nie tak ;(',
              duration: 1500,
              position: 'bottom',
            });
        }
    }

    const deleteTraining  = async (trainingId: string) => {
        showAlert({
        header: 'Potwierdź!',
        message: 'Na pewno chcesz usunąć tą aktywność?',
        buttons: [
            { text: 'Anuluj', role: 'cancel' },
            {
            text: 'Usuń',
            handler: async () => {
                try {
                  await axios.delete(ApiConstant.apiUrl + `/trainings/${trainingId}`,
                  { headers: {
                      Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
                  }});
                  showToast({
                      message: 'Usunięto aktywność!',
                      duration: 1500,
                      position: 'bottom',
                  });
                    await refreshTrainings();
                } catch(err: any) {
                   showToast({
                    message: String(err.response.data.message) ?? 'Coś poszło nie tak :(',
                    duration: 1500,
                    position: 'bottom',
                  });
                }
            },},],
        });
    }

    return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Dodatkowe aktywności</IonTitle>
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

        <IonGrid>
          <IonRow className="ion-align-items-center ion-justify-content-center">
            <IonButton color="success" id="add-training-modal">
            <IonIcon slot="start" icon={add}></IonIcon>
              Dodaj aktywność
            </IonButton>
          </IonRow>
        </IonGrid>

        {trainings.map((training, index) => (
          <IonCard key={index}>
            <IonCardContent className="ion-no-padding">
              <IonItem lines="none">
                <IonInput name="name" placeholder="Wpisz nazwę" value={training.name}></IonInput>
                <IonButton color="warning" onClick={(e) => editTraining(e, training.id)}>
                  <IonIcon slot="icon-only" icon={create}></IonIcon>
                </IonButton>
                <IonButton color="danger" onClick={() => deleteTraining(training.id)}>
                  <IonIcon slot="icon-only" icon={trash}></IonIcon>
                </IonButton>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}

        <IonModal ref={addTrainingModal} trigger="add-training-modal">
        <IonHeader>
        <IonToolbar color={'primary'}>
            <IonButtons slot="start">
            <IonButton onClick={() => addTrainingModal.current?.dismiss()}>Close</IonButton>
            </IonButtons>
        </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Wpisz nazwę aktywności</IonCardTitle>
                  <IonList>
                    <IonItem>
                      <IonInput ref={addTrainingInput} className="ion-text-right" name="name" label="Nazwa:" placeholder="Wpisz nazwę"></IonInput>
                    </IonItem>`
                </IonList>
            </IonCardHeader>
            <IonGrid>
                <IonRow className="ion-align-items-center ion-justify-content-center">
                    <IonButton color="tertiary" onClick={addTraining}>ZAPISZ</IonButton>
              </IonRow>
            </IonGrid>
        </IonCard>
        </IonContent>
      </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Trainings;
