import './List.css';

import axios from 'axios';
import { add, build, trash } from 'ionicons/icons';
import React, { FormEventHandler, useEffect, useRef, useState } from 'react';

import {
    IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip,
    IonContent, IonDatetime, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem,
    IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow,
    IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonSkeletonText,
    IonTitle, IonToolbar, useIonAlert, useIonToast, useIonViewWillEnter
} from '@ionic/react';

import { ApiConstant } from '../../shared/constant/api.constants';
import { Store } from '../../shared/store';

const List: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<any[]>([]);
    const [showAlert] = useIonAlert();
    const [showToast] = useIonToast();
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [availableTrainings, setAvailableTrainings] = useState<any>(null);
    const [availableFunctions, setAvailableFunctions] = useState<any>(null);
    const modal = useRef<HTMLIonModalElement>(null);
    const changeModal = useRef<HTMLIonModalElement>(null);
    const assignTrainingModal = useRef<HTMLIonModalElement>(null);
    const assignFunctionsModal = useRef<HTMLIonModalElement>(null);
    const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
    const [me, setMe] = useState<{role: string} | null>(null);
    const page = useRef(null);
    const roleInput = useRef<HTMLIonSelectElement>(null);
    const statusInput = useRef<HTMLIonSelectElement>(null);
    const trainingInput = useRef<HTMLIonSelectElement>(null);
    const functionsInput = useRef<HTMLIonSelectElement>(null);
    const functionsYearInput = useRef<HTMLIonInputElement>(null);

    useEffect(() => {
        Store.getInstance().get('me').then((me) => setMe(me));
    }, []);

    const [activeSegment, setActiveSegment] = useState<any>('details');

    useEffect(() => {
        setPresentingElement(page.current);
    }, []);

    useIonViewWillEnter(async () => {
        const users = await getUsers();
        setUsers(users);
        setLoading(false);
    });

    const getUsers = async () => {
      const {data} = await axios.get(ApiConstant.apiUrl + '/accounts',
      {
          headers: {
              Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
          }
      });
      return data;
    };

    const setSelectedUserQuery = async (id: string) => {
    const {data} = await axios.get(ApiConstant.apiUrl + `/accounts/${id}`,
    {
        headers: {
            Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
        }
    });
    setSelectedUser(data);
    }

    const doRefresh = async (event: any) => {
      const data = await getUsers();
      setUsers(data);
      event.detail.complete();
    };

    const getColorStatus = (status: string) => {
    switch(status){
        case 'BABY': return 'secondary';
        case 'FULL': return 'tertiary';
        case 'MEMBER': return 'primary';
    }
    }

    const searchUser: FormEventHandler<HTMLIonSearchbarElement> = async (e) => {
    //@ts-ignore
    const search: string = e.target.value.toLowerCase();
    const data = await getUsers();

    if(search) return setUsers(data.filter((user: any) => {
      return (
        user.email.toLowerCase().includes(search) ||
        user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search) ||
        user.status.toLowerCase().includes(search)
    )}));
    return setUsers(data);
    }

    const updateRoleAndStatus = async () => {
        const {status} = await axios.patch(ApiConstant.apiUrl + `/accounts/${selectedUser?.id}/role-and-status`,
        {
            role: roleInput.current?.value,
            status: statusInput.current?.value
        },
        {
          headers: {
            Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
        }});
        if(status === 204){
            showToast({
            message: 'Zmieniono!',
            duration: 1500,
            position: 'bottom',
            });
            setSelectedUserQuery(selectedUser?.id);
            changeModal.current?.dismiss()
        } else {
            showToast({
            message: 'Coś poszło nie tak ;(',
            duration: 1500,
            position: 'bottom',
            });
        }
    }

    const deleteUser = async () => {
        showAlert({
        header: 'Potwierdź!',
        message: 'Na pewno chcesz usunąć tego użytkownika?',
        buttons: [
            { text: 'Anuluj', role: 'cancel' },
            {
            text: 'Usuń',
            handler: async () => {
                const {status} = await axios.delete(ApiConstant.apiUrl + `/accounts/${selectedUser?.id}`,
                {   headers: {
                        Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
                }});
                if(status === 204){
                    showToast({
                    message: 'Usunięto!',
                    duration: 1500,
                    position: 'bottom',
                    });
                    setSelectedUser(null);
                    const data = await getUsers();
                    setUsers(data);
                    changeModal.current?.dismiss()
                } else {
                    showToast({
                    message: 'Coś poszło nie tak ;(',
                    duration: 1500,
                    position: 'bottom',
                    });
                }
            },},],
        });
    }

    const unassignTraining = async (accountId: string, trainingId: string) => {
        showAlert({
        header: 'Potwierdź!',
        message: 'Na pewno chcesz odpisać tą aktywność?',
        buttons: [
            { text: 'Anuluj', role: 'cancel' },
            {
            text: 'Usuń',
            handler: async () => {
                const {status} = await axios.post(ApiConstant.apiUrl + `/trainings/unassign-from-account`,
                {
                  trainingId,
                  accountId,
                },{
                  headers: {
                    Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
                }});
                if(status === 204){
                    showToast({
                    message: 'Odpisano aktywność!',
                    duration: 1500,
                    position: 'bottom',
                    });
                    await setSelectedUserQuery(selectedUser.id);
                } else {
                    showToast({
                    message: 'Coś poszło nie tak ;(',
                    duration: 1500,
                    position: 'bottom',
                    });
                }
            },},],
        });
    }

    const getAvailableTrainings = async () => {
      const {data} = await axios.get(ApiConstant.apiUrl + '/trainings',
      {
          headers: {
              Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
          }
      });
      return data;
    }

    useEffect(() => {
        getAvailableTrainings().then((trainings) => {
          const userTrainingsIds = selectedUser?.trainings.map((training: { id: string; }) => training.id) || [];
          const availableTrainings = trainings.filter(({id} : {id: string}) => !userTrainingsIds.includes(id))
          setAvailableTrainings(availableTrainings);
        });
    }, [selectedUser]);

    const addNewTrening = async () => {
       const {status} = await axios.post(ApiConstant.apiUrl + `/trainings/assign-to-account`,
        {
            trainingId: trainingInput.current?.value,
            accountId: selectedUser.id
        },
        {
          headers: {
            Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
        }});
        if(status === 204){
            showToast({
            message: 'Dodano!',
            duration: 1500,
            position: 'bottom',
            });
            setSelectedUserQuery(selectedUser?.id);
            assignTrainingModal.current?.dismiss()
        } else {
            showToast({
            message: 'Coś poszło nie tak ;(',
            duration: 1500,
            position: 'bottom',
            });
        }
    }

    const getAvailableFunctions = async () => {
      const {data} = await axios.get(ApiConstant.apiUrl + '/functions',
      {
          headers: {
              Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
          }
      });
      return data;
    }

    useEffect(() => {
      getAvailableFunctions().then((func) => {
        setAvailableFunctions(func);
      });
    }, [selectedUser]);

    const addNewFunction = async () => {
        const {status} = await axios.post(ApiConstant.apiUrl + `/functions/assign-to-account`,
        {
            funcId: functionsInput.current?.value,
            year: functionsYearInput.current?.value,
            accountId: selectedUser.id
        }, {
          headers: {
            Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
        }});
        if(status === 204){
            showToast({
            message: 'Dodano!',
            duration: 1500,
            position: 'bottom',
            });
            setSelectedUserQuery(selectedUser?.id);
            assignFunctionsModal.current?.dismiss()
        } else {
            showToast({
            message: 'Coś poszło nie tak ;(',
            duration: 1500,
            position: 'bottom',
            });
        }
    }

    const unassignFunction = async (accountId: string, accountFunctionId: string) => {
      showAlert({
      header: 'Potwierdź!',
      message: 'Na pewno chcesz odpisać tę funkcję?',
      buttons: [
          { text: 'Anuluj', role: 'cancel' },
          {
          text: 'Usuń',
          handler: async () => {
              const {status} = await axios.post(ApiConstant.apiUrl + `/functions/unassign-from-account`,
              {
                accountFunctionId,
                accountId,
              },{
                headers: {
                  Authorization: 'Bearer ' + await Store.getInstance().get('access_token'),
              }});
              if(status === 204){
                  showToast({
                  message: 'Odpisano funkcję!',
                  duration: 1500,
                  position: 'bottom',
                  });
                  await setSelectedUserQuery(selectedUser.id);
              } else {
                  showToast({
                  message: 'Coś poszło nie tak ;(',
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
          <IonTitle>Członkowie</IonTitle>
        </IonToolbar>
        <IonToolbar color={'primary'}>
          <IonSearchbar
            placeholder="Szukaj"
            onInput={searchUser}
            ></IonSearchbar>
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

        {users.map((user, index) => (
          <IonCard key={index} onClick={() => setSelectedUserQuery(user.id)}>
            <IonCardContent className="ion-no-padding">
              <IonItem lines="none">
                <IonLabel>
                  {user.firstName} {user.lastName}
                  <p>{user.email}</p>
                </IonLabel>
                <IonChip slot="end" color={getColorStatus(user.status)}>
                  {user.status}
                </IonChip>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}

        <IonModal breakpoints={[0, 0.5, 0.8, 0.99]} initialBreakpoint={0.8} ref={modal} isOpen={selectedUser !== null} onIonModalDidDismiss={() => setSelectedUser(null)}>
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Close</IonButton>
              </IonButtons>
              <IonTitle>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </IonTitle>
            </IonToolbar>
            <IonToolbar className="ion-no-padding" color={'light'}>
            <IonButtons slot="start">
                <IonChip color={getColorStatus(selectedUser?.status)}>
                    {selectedUser?.status}
                </IonChip>
            </IonButtons>
            <p className='center'>
                {selectedUser?.nick ?? 'Brak nicku'}
            </p>
            <IonButtons slot="end">
                <IonChip outline={true}>
                    {selectedUser?.role}
                </IonChip>
            </IonButtons>
            </IonToolbar>
            <IonToolbar color={'light'}>
              <IonSegment value={activeSegment} onIonChange={(e) => setActiveSegment(e.detail.value!)}>
                <IonSegmentButton value="details">Dane</IonSegmentButton>
                <IonSegmentButton value="functions">Funkcje</IonSegmentButton>
                <IonSegmentButton value="trenings">INNE</IonSegmentButton>
              </IonSegment>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {activeSegment === 'details' && (
              <IonList>
              <IonCard>
                <IonCardContent className="ion-no-padding">
                  <IonItem lines="full">
                    <IonLabel class="ion-text-wrap">
                        <p>E-mail</p>
                        {selectedUser?.email}
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel class="ion-text-wrap">
                        <p>Urodziny</p>
                        {selectedUser?.birthday ?? 'Brak'}
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel class="ion-text-wrap">
                        <p>Dołączył</p>
                        {selectedUser?.joined ?? 'Brak'}
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel class="ion-text-wrap">
                        <p>Numer telefonu</p>
                        {selectedUser?.phoneNumber ?? 'Brak'}
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel class="ion-text-wrap">
                        <p>Rozmiar koszulki</p>
                        {selectedUser?.tShirtSize ?? 'Brak'}
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel class="ion-text-wrap">
                        <p>Adres</p>
                        {(selectedUser?.address + ' ' + selectedUser?.city + ' ' + selectedUser?.zipCode) ?? 'Brak' }
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel class="ion-text-wrap">
                        <p>Wydział</p>
                        {selectedUser?.faculty ?? 'Brak'}
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel class="ion-text-wrap">
                        <p>Kierunek</p>
                        {selectedUser?.fieldOfStudy ?? 'Brak'}
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel class="ion-text-wrap">
                        <p>Rok</p>
                        {selectedUser?.studyYear ?? 'Brak'}
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel class="ion-text-wrap">
                        <p>Grupa</p>
                        {selectedUser?.studyGroup ?? 'Brak'}
                    </IonLabel>
                  </IonItem>
                </IonCardContent>
              </IonCard>
              </IonList>
            )}
            {activeSegment === 'functions' &&
                <IonList lines="full">
                  {me?.role !== 'USER' &&
                     <>
                     <IonGrid>
                      <IonRow className="ion-align-items-center ion-justify-content-center">
                        <IonButton color="success" id="assign-funcions-modal">
                        <IonIcon slot="start" icon={add}></IonIcon>
                          Dodaj
                        </IonButton>
                      </IonRow>
                    </IonGrid>

                    <IonModal ref={assignFunctionsModal} trigger="assign-funcions-modal" presentingElement={presentingElement!}>
                      <IonHeader>
                      <IonToolbar color={'primary'}>
                          <IonButtons slot="start">
                          <IonButton onClick={() => assignFunctionsModal.current?.dismiss()}>Close</IonButton>
                          </IonButtons>
                          <IonTitle>Dodaj dla</IonTitle>
                          <span>{selectedUser?.email}</span>
                      </IonToolbar>
                      </IonHeader>
                      <IonContent className="ion-padding">
                      <IonCard>
                          <IonCardHeader>
                              <IonCardTitle>Wybierz funckje</IonCardTitle>
                          </IonCardHeader>
                                <IonList>
                                <IonItem>
                                  <IonSelect ref={functionsInput} placeholder="Wybierz funckję">
                                    {
                                      availableFunctions?.map((availableFunction: { id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; project: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }; }) => (
                                        <IonSelectOption  key={availableFunction.id} value={availableFunction.id}>{availableFunction.name} | {availableFunction.project.name}</IonSelectOption>
                                      ))
                                    }
                                  </IonSelect>
                                  </IonItem>
                                <IonItem>
                                  <IonInput ref={functionsYearInput} name="studyYear" placeholder="Wpisz rok funkcji"></IonInput>
                                </IonItem>
                              </IonList>
                          <IonGrid>
                              <IonRow className="ion-align-items-center ion-justify-content-center">
                                  <IonButton color="tertiary" onClick={addNewFunction}>ZAPISZ</IonButton>
                            </IonRow>
                          </IonGrid>
                      </IonCard>
                      </IonContent>
                    </IonModal>
                    </>
                  }
                  {selectedUser?.functions && selectedUser?.functions.map((func: any, index: number) => (
                      <IonItem key={index}>
                          <IonLabel>{func.organizationFunction.name} | {func.organizationFunction.project.name} | {func.year}</IonLabel>
                          {me?.role !== 'USER' &&
                            <IonButton color="danger" onClick={() => unassignFunction(selectedUser.id, func.id)}>
                              <IonIcon slot="icon-only" icon={trash}></IonIcon>
                            </IonButton>
                          }
                      </IonItem>
                  ))}
                </IonList>
            }
            {activeSegment === 'trenings' &&
                <IonList lines="full">
                    {me?.role !== 'USER' &&
                     <>
                     <IonGrid>
                      <IonRow className="ion-align-items-center ion-justify-content-center">
                        <IonButton color="success" id="assign-training-modal">
                        <IonIcon slot="start" icon={add}></IonIcon>
                          Dodaj
                        </IonButton>
                      </IonRow>
                    </IonGrid>

                    <IonModal ref={assignTrainingModal} trigger="assign-training-modal" presentingElement={presentingElement!}>
                      <IonHeader>
                      <IonToolbar color={'primary'}>
                          <IonButtons slot="start">
                          <IonButton onClick={() => assignTrainingModal.current?.dismiss()}>Close</IonButton>
                          </IonButtons>
                          <IonTitle>Dodaj dla</IonTitle>
                          <span>{selectedUser?.email}</span>
                      </IonToolbar>
                      </IonHeader>
                      <IonContent className="ion-padding">
                      <IonCard>
                          <IonCardHeader>
                              <IonCardTitle>Wybierz aktywność</IonCardTitle>
                          </IonCardHeader>
                                <IonList>
                                <IonItem>
                                  <IonSelect ref={trainingInput} placeholder="Select">
                                  {
                                    availableTrainings?.map((availableTraining: {id:string, name: string}) => (
                                      <IonSelectOption  key={availableTraining.id} value={availableTraining.id}>{availableTraining.name}</IonSelectOption>
                                    ))
                                  }
                                </IonSelect>
                              </IonItem>
                              </IonList>
                          <IonGrid>
                              <IonRow className="ion-align-items-center ion-justify-content-center">
                                  <IonButton color="tertiary" onClick={addNewTrening}>ZAPISZ</IonButton>
                            </IonRow>
                          </IonGrid>
                      </IonCard>
                      </IonContent>
                    </IonModal>
                    </>
                    }
                    {selectedUser?.trainings && selectedUser?.trainings.map((training: {id:string, name: string}, index: number) => (
                        <IonItem key={index}>
                            <IonLabel>{training.name}</IonLabel>
                            {me?.role !== 'USER' &&
                            <IonButton color="danger" onClick={() => unassignTraining(selectedUser.id, training.id)}>
                              <IonIcon slot="icon-only" icon={trash}></IonIcon>
                            </IonButton>
                            }
                        </IonItem>
                    ))}
                </IonList>
            }
          </IonContent>
        {me?.role !== 'USER' &&
        <IonFab horizontal="end" slot="fixed">
            <IonFabButton size="small" id="change-modal">
                <IonIcon icon={build} />
            </IonFabButton>
        </IonFab>
        }

        <IonModal ref={changeModal} trigger="change-modal" presentingElement={presentingElement!}>
            <IonHeader>
            <IonToolbar color={'primary'}>
                <IonButtons slot="start">
                <IonButton onClick={() => changeModal.current?.dismiss()}>Close</IonButton>
                </IonButtons>
                <IonTitle>Zmień rolę i status</IonTitle>
                <span>{selectedUser?.email}</span>
            </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>Wybierz rolę</IonCardTitle>
                        <IonList>
                        <IonItem>
                        <IonSelect ref={roleInput} disabled={selectedUser?.role === 'ADMIN' && me?.role !== 'ADMIN'} aria-label="role" placeholder="Select role" value={selectedUser?.role}>
                        <IonSelectOption  value="USER">USER</IonSelectOption>
                        <IonSelectOption value="BOARD">ZARZĄD</IonSelectOption>
                        {me?.role === 'ADMIN' &&
                        <IonSelectOption value="ADMIN">ADMIN</IonSelectOption>
                        }
                        </IonSelect>
                    </IonItem>
                    </IonList>
                </IonCardHeader>
                <IonCardHeader>
                    <IonCardTitle>Wybierz status</IonCardTitle>
                        <IonList>
                        <IonItem>
                        <IonSelect ref={statusInput} aria-label="status" placeholder="Select status" value={selectedUser?.status}>
                        <IonSelectOption value="BABY">BABY</IonSelectOption>
                        <IonSelectOption value="MEMBER">MEMBER</IonSelectOption>
                        <IonSelectOption value="FULL">FULL</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    </IonList>
                </IonCardHeader>
                 <IonGrid>
                    <IonRow className="ion-align-items-center ion-justify-content-center">
                        <IonButton color="tertiary" onClick={updateRoleAndStatus}>ZAPISZ</IonButton>
                   </IonRow>
                </IonGrid>
            </IonCard>
            <IonCard>
                <IonGrid>
                    <IonRow className="ion-align-items-center ion-justify-content-center">
                        <IonButton color="danger" onClick={deleteUser}>USUŃ URZYTKOWNIKA</IonButton>
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

export default List;
