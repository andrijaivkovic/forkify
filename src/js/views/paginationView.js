// Imports
import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  // PROTECTED FIELD

  // Parent element
  _parentElement = document.querySelector('.pagination');

  // PUBLIC METHODS

  // Publisher - Subscriber pattern
  addHandlerClick(handler) {
    // Adding the event listener to the parent element - Event delegation
    this._parentElement.addEventListener('click', function (e) {
      // We can select the button that was clicked by looking for the closest parent element that has the inputed class - the button that we are looking for (eg. if we click on the text or a graphic inside of the button and not directly on the button, button will be selected instead)
      const button = e.target.closest('.btn--inline');

      // If we clicked on the part of the parent element that wasn't a button
      if (!button) return;

      // By selecting the button that was clicked we can take the data from it's data attr.
      const goToPage = +button.dataset.goto;

      // Calling the handler function
      handler(goToPage);
    });
  }

  // PROTECTED METHODS

  // Function to generate an HTML element for this 'View'
  _generateMarkup() {
    // Current page
    const currentPage = this._data.page;

    // Calculating number of pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // SCENARIOS:

    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    // Last page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
    `;
    }

    // Other page
    if (currentPage < numPages) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
        </button>
        `;
    }

    // Page 1, and there are no other pages
    return '';
  }
}

export default new PaginationView();

/* <button class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
        <use href="src/img/icons.svg#icon-arrow-left"></use>
    </svg>
    <span>Page 1</span>
</button>
<button class="btn--inline pagination__btn--next">
    <span>Page 3</span>
    <svg class="search__icon">
        <use href="src/img/icons.svg#icon-arrow-right"></use>
    </svg>
</button> */
