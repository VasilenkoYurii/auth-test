import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  set,
  ref,
  update,
  get,
  child,
  userId,
} from 'firebase/database';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDD_Eh4tyvM30ivpTHWqfHo7r2h0gDev4Y',
  authDomain: 'project-goit2023-js.firebaseapp.com',
  databaseURL: 'https://project-goit2023-js-default-rtdb.firebaseio.com',
  projectId: 'project-goit2023-js',
  storageBucket: 'project-goit2023-js.appspot.com',
  messagingSenderId: '407142734195',
  appId: '1:407142734195:web:6d45ec3cdde16415370d06',
  measurementId: 'G-VMY0EQ75TG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

const usersRef = ref(database, 'users');

const refses = {
  body: document.querySelector('body'),
  singUp: document.querySelector('#singUp'),
  login: document.querySelector('#login'),
  logOut: document.querySelector('#logOut'),
};

// Добавление в базу пользователя

refses.singUp.addEventListener('click', e => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

  console.log(email);

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      //
      const user = userCredential.user;

      set(ref(database, 'users/' + user.uid), {
        username: username,
        email: email,
        password: password,
      });

      alert('user created');
      //
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      alert(errorMessage);
    });
});

// Вход пользователя в акаунт

refses.login.addEventListener('click', e => {
  const email = document.getElementById('emailLogin').value;
  const password = document.getElementById('passwordLogin').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;

      const dt = new Date();
      update(ref(database, 'users/' + user.uid), {
        last_login: dt,
      });

      alert('User loged in!');
      location.reload();
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      alert(errorMessage);
    });
});

// Выход польвателя с акаунта

refses.logOut.addEventListener('click', e => {
  signOut(auth)
    .then(() => {
      alert('User loged out!');
      location.reload();
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      alert(errorMessage);
    });
});

// Функция котоая делает чо угодно после того как пользователь
// или залогинился или вышел с акаунтта

const user = auth.currentUser;
onAuthStateChanged(auth, user => {
  if (user) {
    const uid = user.uid;
    refses.body.style.backgroundColor = 'teal';
    // location.reload();
  } else {
  }
});

// Получение масива пользователей

get(usersRef)
  .then(snapshot => {
    const users = [];
    snapshot.forEach(childSnapshot => {
      const user = childSnapshot.val();
      console.log(user);
      user.id = childSnapshot.key;
      users.push(user);
    });
    console.log(users);
  })
  .catch(error => {
    console.error(error);
  });
