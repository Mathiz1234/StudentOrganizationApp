import axios from 'axios';
import { add, create, trash } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';

import {
    IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip,
    IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList,
    IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSkeletonText,
    IonTitle, IonToolbar, useIonAlert, useIonToast, useIonViewWillEnter
} from '@ionic/react';

import { ApiConstant } from '../../shared/constant/api.constants';
import { Store } from '../../shared/store';

const Projects: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [projetcs, setProjects] = useState<any[]>([]);
    const [showAlert] = useIonAlert();
    const [showToast] = useIonToast();
    const page = useRef(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [projectFunctions, setProjectFunctions] = useState<any[]>([]);
    const functionsModal = useRef<HTMLIonModalElement>(null);
    const addProjectModal = useRef<HTMLIonModalElement>(null);
    const addFuncModal = useRef<HTMLIonModalElement>(null);
    const addProjectInput = useRef<HTMLIonInputElement>(null);
    const addFuncInput = useRef<HTMLIonInputElement>(null);

    useIonViewWillEnter(async () => {
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

    const refreshProjects = async () => {
      const data = await getProjects();
      setProjects(data);
    }

    const doRefresh = async (event: any) => {
      await refreshProjects();
      event.detail.complete();
    };

    const addProject = async () => {
        const {status} = await axios.post(ApiConstant.apiUrl + `/projects`,
        {
            name: addProjectInput.current?.value,
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
            refreshProjects();
            addProjectModal.current?.dismiss()
        } else {
            showToast({
              message: 'Coś poszło nie tak ;(',
              duration: 1500,
              position: 'bottom',
            });
        }
    }

    const editProject  = async (e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, projectId: string) => {
      const target = e.target as HTMLElement;
      const input = [...target.parentElement!.children][0] as HTMLInputElement;
      const {status} = await axios.post(ApiConstant.apiUrl + `/projects/${projectId}`,
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
            refreshProjects();
        } else {
            showToast({
              message: 'Coś poszło nie tak ;(',
              duration: 1500,
              position: 'bottom',
            });
        }
    }

    const deleteProject  = async (projectId: string) => {
        showAlert({
        header: 'Potwierdź!',
        message: 'Na pewno chcesz usunąć ten projekt?',
        buttons: [
            { text: 'Anuluj', role: 'cancel' },
            {
            text: 'Usuń',
            handler: async () => {
                try {
                  await axios.delete(ApiConstant.apiUrl + `/projects/${projectId}`,
                  { headers: {
                      Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
                  }});
                  showToast({
                      message: 'Usunięto projekt!',
                      duration: 1500,
                      position: 'bottom',
                  });
                    await refreshProjects();
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

    const getFunctions = async () => {
      const {data} = await axios.get(ApiConstant.apiUrl + '/functions',
      {
          headers: {
              Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
          }
      });
      return data;
    };

    useEffect(() => {
      refreshFunctions();
    }, [selectedProject])

    const refreshFunctions = async () => {
      getFunctions().then((data) => {
        const functions = data.filter((func: { project: { id: string; }; }) => func.project.id === selectedProject.id);
        setProjectFunctions(functions);
      });
    }

    const addFunction = async () => {
        const {status} = await axios.post(ApiConstant.apiUrl + `/functions`,
        {
            name: addFuncInput.current?.value,
            projectId: selectedProject.id,
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

            await refreshFunctions();
            addFuncModal.current?.dismiss()
        } else {
            showToast({
              message: 'Coś poszło nie tak ;(',
              duration: 1500,
              position: 'bottom',
            });
        }
    }

    const editFunction  = async (e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, functionId: string) => {
      const target = e.target as HTMLElement;
      const input = [...target.parentElement!.children][0] as HTMLInputElement;
      const {status} = await axios.post(ApiConstant.apiUrl + `/functions/${functionId}`,
        {
            name: input.value,
            projectId: selectedProject.id,
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
            await refreshFunctions();
        } else {
            showToast({
              message: 'Coś poszło nie tak ;(',
              duration: 1500,
              position: 'bottom',
            });
        }
    }

    const deleteFunction  = async (functionId: string) => {
        showAlert({
        header: 'Potwierdź!',
        message: 'Na pewno chcesz usunąć tą funkcję?',
        buttons: [
            { text: 'Anuluj', role: 'cancel' },
            {
            text: 'Usuń',
            handler: async () => {
                try {
                  await axios.delete(ApiConstant.apiUrl + `/functions/${functionId}`,
                  { headers: {
                      Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
                  }});
                  showToast({
                      message: 'Usunięto funkcję!',
                      duration: 1500,
                      position: 'bottom',
                  });
                  await refreshFunctions();
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
          <IonTitle>Projekty</IonTitle>
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
            <IonButton color="success" id="add-project-modal">
            <IonIcon slot="start" icon={add}></IonIcon>
              Dodaj projekt
            </IonButton>
          </IonRow>
        </IonGrid>

        {projetcs.map((project, index) => (
          <IonCard key={index}>
            <IonCardContent className="ion-no-padding">
              <IonItem lines="none">
                <IonInput name="name" placeholder="Wpisz nazwę" value={project.project.name}></IonInput>
                <IonButton color="warning" onClick={(e) => editProject(e, project.project.id)}>
                  <IonIcon slot="icon-only" icon={create}></IonIcon>
                </IonButton>
                <IonButton color="danger" onClick={() => deleteProject(project.project.id)}>
                  <IonIcon slot="icon-only" icon={trash}></IonIcon>
                </IonButton>
              </IonItem>
              <IonItem>
                <IonGrid>
                  <IonRow class="ion-justify-content-start">
                    <IonCol size="12">
                      <IonButton className="ion-text-right" color="secondary" size="small" onClick={() => setSelectedProject(project.project)}>Funckje projektu</IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}

      <IonModal ref={addProjectModal} trigger="add-project-modal">
        <IonHeader>
        <IonToolbar color={'primary'}>
            <IonButtons slot="start">
            <IonButton onClick={() => addProjectModal.current?.dismiss()}>Close</IonButton>
            </IonButtons>
        </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Wpisz nazwę projektu</IonCardTitle>
                  <IonList>
                    <IonItem>
                      <IonInput ref={addProjectInput} className="ion-text-right" name="name" label="Nazwa:" placeholder="Wpisz nazwę"></IonInput>
                    </IonItem>`
                </IonList>
            </IonCardHeader>
            <IonGrid>
                <IonRow className="ion-align-items-center ion-justify-content-center">
                    <IonButton color="tertiary" onClick={addProject}>ZAPISZ</IonButton>
              </IonRow>
            </IonGrid>
        </IonCard>
        </IonContent>
      </IonModal>

      <IonModal breakpoints={[0, 0.5, 0.8, 0.99]} initialBreakpoint={0.8} ref={functionsModal} isOpen={selectedProject !== null} onIonModalDidDismiss={() => setSelectedProject(null)}>
        <IonHeader>
          <IonToolbar color={'light'}>
            <IonButtons slot="start">
              <IonButton onClick={() => functionsModal.current?.dismiss()}>Close</IonButton>
            </IonButtons>
            <IonTitle>
              {selectedProject?.name} Funkcje
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonGrid>
            <IonRow className="ion-align-items-center ion-justify-content-center">
              <IonButton color="success" id="add-func-modal">
              <IonIcon slot="start" icon={add}></IonIcon>
                Dodaj funckje
              </IonButton>
            </IonRow>
          </IonGrid>
          {projectFunctions.map((func, index) => (
            <IonCard key={index}>
            <IonCardContent className="ion-no-padding">
              <IonItem lines="none">
                <IonInput name="name" placeholder="Wpisz nazwę" value={func.name}></IonInput>
                <IonButton color="warning" onClick={(e) => editFunction(e, func.id)}>
                  <IonIcon slot="icon-only" icon={create}></IonIcon>
                </IonButton>
                <IonButton color="danger" onClick={() => deleteFunction(func.id)}>
                  <IonIcon slot="icon-only" icon={trash}></IonIcon>
                </IonButton>
              </IonItem>
            </IonCardContent>
            </IonCard>
           ))}
        </IonContent>

        <IonModal ref={addFuncModal} trigger="add-func-modal">
        <IonHeader>
        <IonToolbar color={'primary'}>
            <IonButtons slot="start">
            <IonButton onClick={() => addFuncModal.current?.dismiss()}>Close</IonButton>
            </IonButtons>
        </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Wpisz nazwę funkcji</IonCardTitle>
                  <IonList>
                    <IonItem>
                      <IonInput ref={addFuncInput} className="ion-text-right" name="name" label="Nazwa:" placeholder="Wpisz nazwę"></IonInput>
                    </IonItem>`
                </IonList>
            </IonCardHeader>
            <IonGrid>
                <IonRow className="ion-align-items-center ion-justify-content-center">
                    <IonButton color="tertiary" onClick={addFunction}>ZAPISZ</IonButton>
              </IonRow>
            </IonGrid>
        </IonCard>
        </IonContent>
      </IonModal>
      </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Projects;
