import './Login.css';

import axios from 'axios';
import GoogleButton from 'react-google-button';

import {
    IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonText, IonTitle, IonToolbar,
    useIonRouter
} from '@ionic/react';
import { useGoogleLogin } from '@react-oauth/google';

import { ApiConstant } from '../../shared/constant/api.constants';
import { Store } from '../../shared/store';

const Login: React.FC = () => {
const router = useIonRouter();

// const googleLogin = useGoogleLogin({
//     flow: 'implicit',
//     scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
//     onSuccess: async (codeResponse) => {
//         const {data} = await axios.post(ApiConstant.apiUrl + '/auth/login', {
//             'authorization_code': '934cef75-95ef-4ad7-bb18-dc07039900bd',
//         },
//         {
//           headers: {
//           'x-api-key': ApiConstant.apiHeaderKey,
//         }});
//         Store.getInstance().set('access_token', data.access_token);
//         router.push('/app', 'root');
//     },
//     onError: errorResponse => console.log(errorResponse),
// });

const googleLogin = async () => {
   const {data} = await axios.post(ApiConstant.apiUrl + '/auth/login', {
            'authorization_code': '934cef75-95ef-4ad7-bb18-dc07039900bd',
        },
        {
          headers: {
          'x-api-key': ApiConstant.apiHeaderKey,
        }});
    const {data: me} = await axios.get(ApiConstant.apiUrl + '/auth/me',
        {
          headers: {
            Authorization: 'Bearer ' + data.access_token,
        }});

    Store.getInstance().set('access_token', data.access_token);
    Store.getInstance().set('me', me);
    router.push('/app', 'root');
}

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="main-header" color="light">Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonGrid className="flex-center">
        <IonRow >
             <GoogleButton
          type="light"
          onClick={() => { googleLogin() }}
        />
        </IonRow>
      </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
