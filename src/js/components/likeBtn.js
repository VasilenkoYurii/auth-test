// import { likeArr } from '../index';
import axios from 'axios';
import { LOCALSTORAGE_USER } from '../firebace';

export const dropdownChild = document.querySelector('.dropdown-child');
const API_KEY = '33687717-ba072cce310c3fac718a1e690';
const BASE_URL = 'https://pixabay.com/api';
let uniqueId = '';
let uniqueArr = [];

export async function likeBtn(e) {
  if (!e.target.classList.contains('button-like-img')) {
    return;
  }

  //   e.target.textContent = 'delite';

  uniqueArr.push(e.target.id);
  uniqueId = unique(uniqueArr);

  const responses = await fetchImagesLike(uniqueId);
  imageToJson(responses);

  const images = renderImgLikes(
    JSON.parse(localStorage.getItem(LOCALSTORAGE_USER))
  );
  dropdownChild.innerHTML = images;
}

const fetchImagesLike = async ids => {
  const promises = ids.map(async id => {
    const url = `${BASE_URL}/?key=${API_KEY}&id=${id}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data.hits[0];
  });

  const responses = await Promise.all(promises);
  return responses;
};

function imageToJson(image) {
  const images = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER)) || [];

  const newImages = image.filter(
    ({ id }) => !images.some(item => item.id === id)
  );
  images.push(...newImages);

  const imagesJSON = JSON.stringify(images);
  localStorage.setItem(LOCALSTORAGE_USER, imagesJSON);
}

function unique(arr) {
  let result = [];

  for (let str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }

  return result;
}

export function renderImgLikes(images) {
  return images
    .map(({ webformatURL, tags, likes, views, comments, downloads, id }) => {
      return `
          <div class="photo-card photo-card__dropdown">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item info-item__dropdown"><b>Likes</b>${likes}</p>
              <p class="info-item info-item__dropdown"><b>Views</b>${views}</p>
              <p class="info-item info-item__dropdown"><b>Comments</b>${comments}</p>
              <p class="info-item info-item__dropdown"><b>Downloads</b>${downloads}</p>
            </div>
            <button class='delite-button__dropdown' id='${id}'>Remove from favorites</button>
          </div>`;
    })
    .join('');
}

export function deliteImageCard(event) {
  if (!event.target.classList.contains('delite-button__dropdown')) {
    return;
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
