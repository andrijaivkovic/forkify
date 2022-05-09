// Imports
import icons from 'url:../../img/icons.svg';

// Parent class of all 'View' modules
export default class View {
  // PROTECTED FIELD
  _data;

  // PUBLIC API

  // Method to render the 'view'
  render(data, render = true) {
    // Guard clause if there is no data (if data is an array first check if it's an array and if it's an array check if it's empty)
    if (!data || (Array.isArray(data) && data.length === 0)) {
      // Render an error message
      return this.renderError();
    }

    // Setting the passed 'data' argument as this 'Views' '_data' property
    this._data = data;
    // Creating a new HTML element and storing the return from the function in to 'markup'
    const markup = this._generateMarkup();

    // if 'render' is set to false, don't attach the generated HTML to the parent element, just return the generated HTML
    if (!render) return markup;

    // Clearing the parent element
    this._clear();
    // Attaching the newly created element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Function that compares the old HTML element to the new HTML element and only updates the parts that are changed
  update(data) {
    // Setting the passed 'data' argument as this 'Views' '_data' property
    this._data = data;
    // Creating a new HTML element (in string format) and storing the return from the function in to 'markup'
    const newMarkup = this._generateMarkup();
    // Creating a new (virtual DOM) that holds the newly created element
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // Selecting all of the elements inside of the newly created virtual DOM and converting that node list to an array
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // Selecting all of the elements inside of the current state of the HTML element that we want to update
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    // Comparing and elements inside 'newElements' and 'currentElements' arrays so we can only update the parts that changed
    newElements.forEach((newElement, i) => {
      // We can also looping over the 'currentElements' array with the same index because both arrays have the same amount of elements
      const currentElement = currentElements[i];

      // #1 Update text

      // Checking if the element has changed using the 'isEqualNode' method and also checking if the element has any text values (this is important because we only want to update the text content of the element, not the whole element)
      if (
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        // Setting the text content of the current element to the text element of the new element
        currentElement.textContent = newElement.textContent;
      }

      // #2 Update attributes
      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach(attribute => {
          currentElement.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }

  // Method to render the spinner loading animation before the 'view' loads
  renderSpinner() {
    // Creating a loading spinner HTML element
    const markup = `
        <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
        `;
    // Clearing the parent element
    this._clear();
    // Attaching the loading spinner to the begining of the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Method for displaying errors on the page
  renderError(message = this._errorMessage) {
    // Creating the error HTML element
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `;
    // Clearing the parent element
    this._clear();
    // Attaching the error element to the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Method for displaying the welcome message
  renderMessage(message = this._message) {
    // Creating the message HTML element
    const markup = `
            <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
            `;
    // Clearing the parent element
    this._clear();
    // Attaching the error element to the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // PROTECTED METHODS

  // Function to clear out the parent element of the 'view'
  _clear() {
    // Clearing out the element we want to attach the newly created element to
    while (this._parentElement.firstChild) {
      this._parentElement.removeChild(this._parentElement.firstChild);
    }
  }
}
