// https://developers.facebook.com/apps/1631818744342096/instagram-business/API-Setup/
// https://developers.facebook.com/docs/instagram-basic-display-api/reference/media

class InstagramGallery extends HTMLElement {
  constructor() {
    super();

    const template = `
      <div id="instagram-gallery" class="instagram-gallery p-5 text-white rounded relative">
        <div class="swiper-container w-full py-5 overflow-hidden">
          <div class="swiper-wrapper"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    `;

    this.innerHTML = template;
  }

  async connectedCallback() {
    const userId = this.getAttribute('user-id');
    const accessToken = this.getAttribute('access-token');
    const swiperWrapper = this.querySelector('.swiper-wrapper');

    // Validate userId and accessToken
    if (!userId || !accessToken) {
      console.error('InstagramGallery: Missing user-id or access-token attributes.');
      return;
    }

    // Fetch Instagram posts
    try {
      const response = await fetch(
        `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink&access_token=${accessToken}`
      );
      const data = await response.json();

      // Add posts to the Swiper slider
      data.data.forEach((post) => {
        if (post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM') {
          let secondImageUrl = null;
          if (post.media_type === 'CAROUSEL_ALBUM' && post.children) {
            secondImageUrl = post.children.data?.[1]?.media_url || null;
          }
          const postElement = `
            <div class="swiper-slide instagram-post relative flex justify-center items-center text-center">
              <a href="${post.permalink}" class="block h-full w-full relative pt-full pb-[100%]" target="_blank">
                <img src="${post.media_url}"
                 class="instagram-main-image max-w-full rounded-lg absolute w-full h-full top-0 left-0 object-cover"
                 data-second-image="${secondImageUrl || ''}"
                 alt="${post.caption || 'Instagram post'}">
                <div class="instagram-caption absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2.5 py-1.5 rounded text-sm">
                  ${post.caption || ''}
                </div>
              </a>
            </div>`;
          swiperWrapper.innerHTML += postElement;
        }
      });

      this.initializeSwiper();
      this.addHoverFunctionality();
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
    }
  }

  initializeSwiper() {
    const swiperScript = document.createElement('script');
    swiperScript.src = 'https://unpkg.com/swiper/swiper-bundle.min.js';
    swiperScript.onload = () => {
      new Swiper(this.querySelector('.swiper-container'), {
        slidesPerView: 1.5,
        spaceBetween: 20,
        loop: true,
        navigation: {
          nextEl: this.querySelector('.swiper-button-next'),
          prevEl: this.querySelector('.swiper-button-prev'),
        },
        pagination: {
          el: this.querySelector('.swiper-pagination'),
          clickable: true,
        },
        breakpoints: {
          768: { slidesPerView: 3 },
          480: { slidesPerView: 1 },
        },
      });
    };

    document.body.appendChild(swiperScript);
  }

  addHoverFunctionality() {
    document.querySelectorAll('.instagram-post').forEach(postElement => {
      const mainImage = postElement.querySelector('.instagram-main-image');
      const caption = postElement.querySelector('.instagram-caption');
      const secondImageUrl = mainImage.getAttribute('data-second-image');

      postElement.addEventListener('mouseenter', () => {
        caption.style.display = 'block';
        if (secondImageUrl) {
          mainImage.setAttribute('src', secondImageUrl);
        }
      });

      postElement.addEventListener('mouseleave', () => {
        caption.style.display = 'none';
        mainImage.setAttribute('src', mainImage.getAttribute('data-original-src') || mainImage.src);
      });

      mainImage.setAttribute('data-original-src', mainImage.src);
    });
  }
}

customElements.define('instagram-gallery', InstagramGallery);
