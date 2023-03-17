import { LOCALSTORAGE_USER } from '../firebace';

export default function renderImageGallery(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        id,
      }) => {
        const buttonText = JSON.parse(
          localStorage.getItem(LOCALSTORAGE_USER)
        )?.some(item => item.id === id)
          ? 'Remove from favorites'
          : 'Add to favorites';

        const buttonClass = JSON.parse(
          localStorage.getItem(LOCALSTORAGE_USER)
        )?.some(item => item.id === id)
          ? 'delite-button__dropdown'
          : 'button-like-img';

        return `
        <div class="gallery__item__link" href="${largeImageURL}">
          <div class="photo-card">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
            <button class="${buttonClass}" id="${id}">${buttonText}</button>
          </div>
        </div>`;
      }
    )
    .join('');
}
