import '../css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import NewsApiService from './components/fetchImages';
import renderImageGallery from './components/renderImageGallery';
import btnUp from './components/btnUp';
import { blackWhite, addStyleBlackWrite } from './components/blackWhite';
//
//
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
    // refses.body.style.backgroundColor = 'teal';
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

//
//
const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryImage: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  sentinel: document.querySelector('#sentinel'),
  toggle: document.querySelector('.toggle'),
};
let messageShown = false;
let totalHit = 0;
addStyleBlackWrite();

const onEntry = entries => {
  entries.forEach(entrie => {
    if (entrie.isIntersecting && newsApiService.query !== '') {
      arrfetchImages();
    }
  });
};
const options = {
  rootMargin: '150px',
};
const observer = new IntersectionObserver(onEntry, options);
const newsApiService = new NewsApiService();
const modal = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', userSearchImages);
refs.toggle.addEventListener('click', blackWhite);

btnUp.addEventListener();

function userSearchImages(e) {
  e.preventDefault();
  observer.unobserve(refs.sentinel);
  messageShown = false;

  newsApiService.query = e.srcElement[0].value.trim();

  if (newsApiService.query === '') {
    Notiflix.Notify.failure('Oops, enter image name');
    return;
  }

  observer.observe(refs.sentinel);
  newsApiService.resetPage();
  deleteRender();
}

function arrfetchImages() {
  setTimeout(() => {
    console.log(totalHit);

    const totalPages = Math.ceil(totalHit / newsApiService.perPage);

    if (newsApiService.page > totalPages) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      observer.unobserve(refs.sentinel);
      return;
    }
  }, 500);

  newsApiService
    .fetchImages()
    .then(response => {
      const arrImages = response.data.hits;
      totalHit = response.data.totalHits;
      newsApiService.incrementPage();

      if (!messageShown && response.data.totalHits !== 0) {
        Notiflix.Notify.info(
          `Hooray! We found ${response.data.totalHits} images.`
        );
        messageShown = true;
      }

      if (arrImages.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      return arrImages;
    })
    .then(images => {
      appendArticlesMarkup(images);
    })
    .catch(error => console.log(error));
}

function appendArticlesMarkup(images) {
  const countryMarkup = renderImageGallery(images);
  refs.galleryImage.insertAdjacentHTML('beforeend', countryMarkup);
  modal.refresh();
  addStyleBlackWrite();
}

function deleteRender() {
  refs.galleryImage.innerHTML = '';
}
