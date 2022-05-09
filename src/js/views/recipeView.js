// Imports

// Parent class
import View from './View.js';

// 3rd-party libraries
import { Fraction } from 'fractional';

// Importing static (non-programming) files

// Parcel v1
// import icons from '../img/icons.svg';

// Parcel v2
import icons from 'url:../../img/icons.svg';

class RecipeView extends View {
  // PROTECTED FIELD (_)

  // Parent element of this 'view'
  _parentElement = document.querySelector('.recipe');

  // Default error message for this 'view'
  _errorMessage = 'We could not find that recipe. Please try another one!';

  // Default welcome message for this 'view'
  _message = '';

  // PUBLIC API

  // Function implemented in Subscriber-Publisher pattern. Since 'View' module of the application shouldn't know about the controller, we need to create a event listener in the 'View' module and then call the method in 'Control' by passing the function that we want to execute when the listener gets triggered
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // We can select the button that was clicked by looking for the closest parent element that has the inputed class - the button that we are looking for (eg. if we click on the text or a graphic inside of the button and not directly on the button, button will be selected instead)
      const button = e.target.closest('.btn--update-servings');

      // Guard clause for if we clicked on the part of the parent element that wasn't a button
      if (!button) return;

      // Reading the data attribute off of the clicked button
      const updateTo = +button.dataset.updateTo;

      // Calling the handler function if the 'updateTo' is larger than zero
      if (updateTo > 0) handler(updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      // Guard clause for if we clicked on the part of the parent element that wasn't a button
      if (!btn) return;
      // Calling the passed handler function
      handler();
    });
  }

  // PROTECTED METHODS

  // Method to generate the HTML element
  _generateMarkup() {
    // Creating and immediately returning the generated HTML element
    return `
    <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>
        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>
            <div class="recipe__info-buttons">
              <button data-update-to="${
                this._data.servings - 1
              }" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button data-update-to="${
                this._data.servings + 1
              }" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>
        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              // Creating a new array that creates a string with HTML for each element of the ingredients array
              .map(this._generateMarkupIngredient)
              // Joins the whole array in to a string
              .join('')}
          </ul>
        </div>
        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
      `;
  }

  // Function to generate the 'ingredient' part of 'view' markup
  _generateMarkupIngredient(ingredient) {
    return `
    <li class="recipe__ingredient">
        <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          // Turnary operator to display the quantity if it exists
          ingredient.quantity
            ? // Using the 'fractional' library to display fractions (eg. display 0.5 as 1/2)
              new Fraction(ingredient.quantity).toString()
            : // If not display an empty string ('')
              ''
        }</div> 
        <div class="recipe__description">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.description}
        </div>
    </li>
    `;
  }
}

// Exporting the Object created using RecipeView class
// Because it is the only thing that we want to export we can use the default export
export default new RecipeView();
