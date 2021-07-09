// ** Router Import
import {useContext} from 'react';
import Router from './router/Router'

//firebase
import firebase from 'firebase/app';

// Provider & context
import { Context } from './ContextComponent';
import { Provider } from './ContextComponent';

const firebaseConfig = {
  apiKey: "AIzaSyCmcpZ2kDTEPYc5uv6da5VKKoPneEKIgv0",
  authDomain: "onairbill.firebaseapp.com",
  projectId: "onairbill",
  storageBucket: "onairbill.appspot.com",
  messagingSenderId: "608878763305",
  appId: "1:608878763305:web:03d6a3cfb74582f6f5ab38",
  measurementId: "G-YKVSPCCJDQ"
};


const App = props => {
  const {loggedIn,printEnable} = useContext(Context); 
  return (<Provider><Router loggedIn printEnable /></Provider>)
}
firebase.initializeApp(firebaseConfig);
export default App
