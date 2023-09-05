import axios from 'axios';
import { add } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';

import {
    IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip,
    IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem,
    IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow,
    IonSelect, IonSelectOption, IonSkeletonText, IonTitle, IonToolbar, useIonToast,
    useIonViewWillEnter
} from '@ionic/react';

import { ApiConstant } from '../../shared/constant/api.constants';
import { Store } from '../../shared/store';

const Feedbacks: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [projetcs, setProjects] = useState<any[]>([]);
    const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
    const page = useRef(null);
    const [showToast] = useIonToast();

    const addFeedbackModal = useRef<HTMLIonModalElement>(null);
    const addFeedbackInput = useRef<HTMLIonInputElement>(null);
    const ddlInput = useRef<HTMLIonDatetimeElement>(null);
    const projectSelect = useRef<HTMLIonSelectElement>(null);


    useEffect(() => {
        setPresentingElement(page.current);
    }, []);

    useIonViewWillEnter(async () => {
        const calls = await getFeedbacks();
        setFeedbacks(calls);
        const projects = await getProjects();
        setProjects(projects);
        setLoading(false);
    });

    const getProjects = async () => {
      const {data} = await axios.get(ApiConstant.apiUrl + '/projects',
      {
          headers: {
              Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
          }
      });
      return data;
    };

    const getFeedbacks = async () => {
      const {data} = await axios.get(ApiConstant.apiUrl + '/deadlines?type=FEEDBACK',
      {
          headers: {
              Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
          }
      });
      return data;
    };

    const doRefresh = async (event: any) => {
      const data = await getFeedbacks();
      setFeedbacks(data);
      event.detail.complete();
    };

    const addCall = async () => {
        const {status} = await axios.post(ApiConstant.apiUrl + `/deadlines`,
        {
            projectId: projectSelect.current?.value,
            description: addFeedbackInput.current?.value,
            ddl: ddlInput.current?.value,
            type: 'FEEDBACK',
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
            const data = await getFeedbacks();
            setFeedbacks(data);
            addFeedbackModal.current?.dismiss()
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
          <IonTitle>Feedbaki</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(ev) => doRefresh(ev)}>
          <IonRefresherContent />
        </IonRefresher>

      <IonGrid>
        <IonRow className="ion-align-items-center ion-justify-content-center">
          <IonButton color="success" id="add-feedback-modal">
          <IonIcon slot="start" icon={add}></IonIcon>
            Dodaj feedback
          </IonButton>
        </IonRow>
      </IonGrid>

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

        {feedbacks.map((feedback, index) => (
          <IonCard key={index}>
            <IonCardContent className="ion-no-padding">
              <IonItem lines="none">
                <IonLabel>
                  {feedback.description}
                  <p>{feedback.project.name}</p>
                </IonLabel>
                <IonChip color="tertiary" slot="end">
                  DDL:
                  {
                  new Date(feedback.ddl).getDate() + '/' + new Date(feedback.ddl).getMonth()
                  }
                </IonChip>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}

      <IonModal ref={addFeedbackModal} trigger="add-feedback-modal">
        <IonHeader>
        <IonToolbar color={'primary'}>
            <IonButtons slot="start">
            <IonButton onClick={() => addFeedbackModal.current?.dismiss()}>Close</IonButton>
            </IonButtons>
        </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Dodaj feedback</IonCardTitle>
                  <IonList>
                    <IonItem>
                      <IonInput ref={addFeedbackInput} className="ion-text-right" name="name" placeholder="Wpisz opis"></IonInput>
                    </IonItem>
                    <IonItem>
                    <IonLabel>DDL: </IonLabel>
                    <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
                    <IonModal keepContentsMounted={true}>
                      <IonDatetime ref={ddlInput} presentation='date' id="datetime"></IonDatetime>
                    </IonModal>
                    </IonItem>
                    <IonItem>
                      <IonSelect ref={projectSelect} placeholder="Wybierz projekt">
                        {
                          projetcs.map(({project}, index) => (
                            <IonSelectOption  key={index} value={project.id}>{project.name}</IonSelectOption>
                          ))
                        }
                      </IonSelect>
                    </IonItem>
                </IonList>
            </IonCardHeader>
            <IonGrid>
                <IonRow className="ion-align-items-center ion-justify-content-center">
                    <IonButton color="tertiary" onClick={addCall}>ZAPISZ</IonButton>
              </IonRow>
            </IonGrid>
        </IonCard>
        </IonContent>
      </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Feedbacks;
function showToast(arg0: { message: string; duration: number; position: string; }) {
  throw new Error('Function not implemented.');
}

