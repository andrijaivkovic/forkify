// Imports

// Importing everything (*) from the Model
import * as model from './model.js';

// Importing configuration values
import { MODAL_CLOSE_SEC } from './config.js';

// Importing the 'view' Objects

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// Importing 3rd-party libraries
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

///////////////////////////////////////

// // Parcel hot modules
// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

// Function for displaying the singular recipe
const controlRecepies = async function () {
  try {
    // Getting the ID from the hash in the URL
    const id = window.location.hash.slice(1);

    // Guard clause if there is no hash in the URL (if 'id' is an empty string, so falsy)
    if (!id) return;

    // Rendering a spinner loading animation
    recipeView.renderSpinner();

    // #0 Update results view to mark the selected seatch result
    resultsView.update(model.getSearchResultPage());

    // #0.5 Update the bookmarks view to highlight the one of the recipes in the list if the same recipe is loaded in the recipe view (if id of one of the recipes in the bookmarks view matches the id in the URL hash)
    bookmarksView.update(model.state.bookmarks);

    // #1 Loading recipe

    // 'loadRecipe' function is an async function and it returns a promise. We need to wait (await keyword) for that promise to resolve and then move on with the code execution
    await model.loadRecipe(id);
    // After, and only after, recieving the data we can access it
    const { recipe } = model.state;

    // #2 Displaying the recipe

    // Display the recipe
    recipeView.render(recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

// Function for displaying the search results
const controlSearchResults = async function () {
  try {
    // Render loading spinner animation
    resultsView.renderSpinner();

    // #1 Get search query
    const query = searchView.getQuery();

    // Guard clause if there is no query
    if (!query) return;

    // #2 Load the search results

    // Async function that gets the data according to the inputed search query and stores the search results in the application's state
    await model.loadSearchResults(query);

    // #3 Render the search results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // #4 Render inital pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

// Function for controlling search result pagination
const controlPagination = function (goToPage) {
  // #1 Render NEW search results
  resultsView.render(model.getSearchResultPage(goToPage));

  // #2 Render NEW pagination buttons
  paginationView.render(model.state.search);
};

// Function for changing required amount of ingredients based on servings
const controlServings = function (servings) {
  // #1 Update the recipe servings in application state
  model.updateServings(servings);

  // #2 Update the recipe views
  recipeView.update(model.state.recipe);
};

// Function for adding a new bookmark
const controlAddBookmark = function () {
  // #1 Bookmarking the recipe if it's not already bookmarked
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // #1.5 Remove the bookmark if it's already bookmarked
  else model.deleteBookmark(model.state.recipe.id);

  // #2 Updating the recipe view
  recipeView.update(model.state.recipe);

  // #3 Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Function that renders bookmarks as soon as the page loads
const controlBookmarks = function () {
  // #1 Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Function for adding a new, user generated, recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // #0.5 Show the loading spinner
    addRecipeView.renderSpinner();

    // #1 Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // #2 Render the uploaded recipe
    recipeView.render(model.state.recipe);

    // #3 Display the success message
    addRecipeView.renderMessage();

    // #4 Render the bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // #5 Change the URL to the ID of the newly created recipe
    window.history.pushState(null, null, `#${model.state.recipe.id}`);

    // #6 Close the form window after the inputed amount of time
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // #5 Updating the bookmarks view
  } catch (error) {
    console.error(error);
    // Rendering the passed error message
    addRecipeView.renderError(error.message);
  }
};

// Initialization function for the 'controller' component
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecepies);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

// Initializing the 'controller' component
init();
