// Imports
import View from './View';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  // Constructor that is used to call the methods as soon as the instance is created
  constructor() {
    // Supper keyword is used to make the class inherit properties and method from its parent class
    super();
    // Calling the methods as soon as the instance is created
    this._addHandlerHideWindow();
    this._addHandlerShowWindow();
  }

  // PROTECTED FIELD

  // Parent element
  _parentElement = document.querySelector('.upload');

  _message = 'Recipe was successfully uploaded!';

  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');

  _buttonOpen = document.querySelector('.nav__btn--add-recipe');
  _buttonClose = document.querySelector('.btn--close-modal');

  // PROTECTED METHODS

  // Function for showing the overlay and form window
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // Fuction that attaches an event listener to the button that is used to show the form window
  _addHandlerShowWindow() {
    this._buttonOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  // Fuction that attaches an event listener to the button and background that are used to hide the form window
  _addHandlerHideWindow() {
    this._buttonClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // PUBLIC METHODS

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      // Preventing the form submit from reloading the page
      e.preventDefault();

      // Getting the data from the form

      // #1 Getting the data using 'FormData' and converting it in to an array using the SPREAD operator
      const dataArray = [...new FormData(this)];

      // #2 Converting the newly created array to an Object
      const data = Object.fromEntries(dataArray);

      // Calling the handler function with the data from the form
      handler(data);
    });
  }
}

export default new AddRecipeView();
