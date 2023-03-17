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
import { renderImgLikes, dropdownChild } from './components/likeBtn';

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
export let LOCALSTORAGE_USER = '';

export const usersRef = ref(database, 'users');

const refses = {
  body: document.querySelector('body'),
  singUp: document.querySelector('#singUp'),
  login: document.querySelector('#login'),
  logOut: document.querySelector('#logOut'),
  containerSignUp: document.querySelector('.login-box__signUp'),
  containerLogIn: document.querySelector('.login-box__logIn'),
  containerLogOut: document.querySelector('.login-box__logOut'),
  userHi: document.querySelector('.user-hi'),
};

// Добавление в базу пользователя

refses.singUp.addEventListener('click', singUpFun);
export function singUpFun(e) {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

  // console.log(email);

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
      location.reload();
      //
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      alert(errorMessage);
    });
}

// Вход пользователя в акаунт

refses.login.addEventListener('click', loginFun);
export function loginFun(e) {
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
}

// Выход польвателя с акаунта

refses.logOut.addEventListener('click', logOutFun);
export function logOutFun(e) {
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
}

// Функция котоая делает что угодно после того как пользователь
// или залогинился или вышел с акаунтта

const user = auth.currentUser;
onAuthStateChanged(auth, user => {
  if (user) {
    LOCALSTORAGE_USER = user.email;
    const images = renderImgLikes(
      JSON.parse(localStorage.getItem(LOCALSTORAGE_USER))
    );
    dropdownChild.innerHTML = images;

    refses.userHi.textContent = `Welcome, ${user.email}`;
    refses.containerSignUp.style.display = 'none';
    refses.containerLogIn.style.display = 'none';
  } else {
    refses.containerLogOut.style.display = 'none';
    LOCALSTORAGE_USER = 'Guest';
    const images = renderImgLikes(
      JSON.parse(localStorage.getItem(LOCALSTORAGE_USER))
    );
    dropdownChild.innerHTML = images;
  }
});

// Получение масива пользователей

get(usersRef)
  .then(snapshot => {
    const users = [];
    snapshot.forEach(childSnapshot => {
      const user = childSnapshot.val();
      // console.log(user.username);
      user.id = childSnapshot.key;
      users.push(user);
    });
    // console.log(users);
  })
  .catch(error => {
    // console.error(error);
  });
