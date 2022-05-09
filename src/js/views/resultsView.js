// Imports
import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  // PRIVATE FIELD

  // Parent element
  _parentElement = document.querySelector('.results');

  // Default error message for this 'view'
  _errorMessage = 'No recepies found for your query! Please try again.';

  // Default welcome message for this 'view'
  _message = '';

  // PROTECTED METHODS

  // Method for generating HTML elements (in this 'view' this method generates all of the an HTML element for each search result)
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
