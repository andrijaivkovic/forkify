// Imports
import View from './View';
import previewView from './previewView';

class BookmarksView extends View {
  // PRIVATE FIELD

  // Parent element
  _parentElement = document.querySelector('.bookmarks__list');

  // Default error message for this 'view'
  _errorMessage =
    'You have no bookmarks yet. Find a recipe you like and bookmark it!';

  // Default welcome message for this 'view'
  _message = '';

  // PROTECTED METHODS

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // Method for generating HTML elements (in this 'view' this method generates all of the an HTML element for each search result)
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
