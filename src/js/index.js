import '../css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import NewsApiService from './components/fetchImages';
import renderImageGallery from './components/renderImageGallery';
import btnUp from './components/btnUp';
import { blackWhite, addStyleBlackWrite } from './components/blackWhite';
import { likeBtn, deliteImageCard } from './components/likeBtn';
import {
  usersRef,
  singUpFun,
  loginFun,
  logOutFun,
  LOCALSTORAGE_USER,
} from './firebace';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryImage: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  sentinel: document.querySelector('#sentinel'),
  toggle: document.querySelector('.toggle'),
  body: document.querySelector('body'),
  singUp: document.querySelector('#singUp'),
  login: document.querySelector('#login'),
  logOut: document.querySelector('#logOut'),
  modalAuth: document.querySelector('.modal-auth'),
  exitModal: document.querySelector('.exit-modal'),
  authButton: document.querySelector('#authButton'),
  deliteBtn: document.querySelector('.delite-button__dropdown'),
};

let messageShown = false;
let totalHit = 0;
export const likeArr = [];
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
refs.authButton.addEventListener('click', modalAuthOpen);
refs.exitModal.addEventListener('click', exitModalFun);

btnUp.addEventListener();

function userSearchImages(e) {
  // galleryImage.removeEventListener('click', onChangeButton);
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
    const totalPages = Math.ceil(totalHit / newsApiService.perPage);

    if (newsApiService.page > totalPages) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      observer.unobserve(refs.sentinel);
      return;
    }
  }, 1000);

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

function modalAuthOpen() {
  refs.modalAuth.style.display = 'block';
}

function exitModalFun() {
  refs.modalAuth.style.display = 'none';
}

refs.galleryImage.addEventListener('click', likeBtn);
refs.body.addEventListener('click', deliteImageCard);
refs.galleryImage.addEventListener('click', onChangeButton);

function onChangeButton(event) {
  const button = event.target;
  if (event.target.classList.contains('delite-button__dropdown')) {
    const button = event.target;
    button.textContent = 'Add to favorites';
    button.classList.remove('delite-button__dropdown');
    button.classList.add('button-like-img');
  } else if (event.target.classList.contains('button-like-img')) {
    const button = event.target;
    button.textContent = 'Remove from favorites';
    button.classList.remove('button-like-img');
    button.classList.add('delite-button__dropdown');
  }
  const idToDelete = event.target.id;

  const images = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER));
  const updatedImages = images.filter(item => item.id !== Number(idToDelete));
  localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(updatedImages));

  const photoCards = document.querySelectorAll('.photo-card__dropdown');
  photoCards.forEach(photoCard => {
    const id = photoCard.querySelector('.delite-button__dropdown').id;
    if (id === idToDelete) {
      photoCard.remove();
    }
  });
}
