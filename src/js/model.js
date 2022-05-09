// Imports
import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';
// import { getJSON, sendJSON } from './helpers.js';

// Current state of the application. Imports have live connection to one another so this state will be the same across all of the modules.
export const state = {
  // Object with the data about the currently displayed recipe
  recipe: {},
  // Object with the data about the search resaults
  search: {
    // Search query (word that we inputed into the search box)
    query: '',
    // Array of objects, each object holds the info about the individual search result
    results: [],
    // Number of results that we want to display per page
    resultsPerPage: RESULTS_PER_PAGE,
    // Current search results page (default is 1, the first page)
    page: 1,
  },
  bookmarks: [],
};

// Function for formating the recipe data recieved from the API
const createRecipeObject = function (data) {
  // Changing key names to title case
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // Conditionally adding object properties
    // If 'recipe.key' doesn't exist, nothing will happen. If 'recipe.key' exists short-circuiting will occur and the object will be created, returned, and added to the parent object using the SPREAD operator
    ...(recipe.key && { key: recipe.key }),
  };
};

// Async function to fetch the data of a single recipe from the API
export const loadRecipe = async function (id) {
  try {
    // Helper function that makes an AJAX call to the inputed URL, converts the recieved data from JSON to an JS Object and returns that Object
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    // Storing the formated recipe in application 'state' Object
    state.recipe = createRecipeObject(data);

    // Setting the 'bookmarked' property of the loaded recipe to true if the 'id' of the loaded recipe is the same as any of the values inside of the 'bookmarks' array, otherwise set it to false
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    // Re-throwing the error again so we can use it in the 'controller' module
    throw error;
  }
};

// Async function to fetch the search results for the given query from the API
export const loadSearchResults = async function (query) {
  try {
    // Helper function that makes an AJAX call to the inputed URL, converts the recieved data from JSON to an JS Object and returns that Object
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.query = query;

    //
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // Reseting the page number back to one when we make a new search
    state.search.page = 1;
  } catch (error) {
    // Re-throwing the error again so we can use it in the 'controller' module
    throw error;
  }
};

// Function that returns the search results that should be displayed for the page that is passed as an argument (if 'page' is 1, display the results that are on the first page)
export const getSearchResultPage = function (page = state.search.page) {
  // Saves the current search results page in the 'state' object
  state.search.page = page;
  // Position of the first element of the 'results' array that will be displayed
  const start = (page - 1) * state.search.resultsPerPage; // if 'page' is 1 'end' will be 0
  // Position of the last element of the 'results' array that will be displayed
  const end = page * state.search.resultsPerPage; // if 'page' is 1 'end' will be 10

  // Return the part of the 'results' array that cooresponds to the inputed page number
  // Slice takes element UP TO the last number in the second argument (so (0, 10) will take from 0 to 9)
  return state.search.results.slice(start, end);
};

// Function for updating the number of servings and amount for each ingredient in the application state
export const updateServings = function (servings) {
  // Change the quanitity of each ingredient based on inputed 'servings'
  state.recipe.ingredients.forEach(
    ingredient =>
      (ingredient.quantity =
        (ingredient.quantity * servings) / state.recipe.servings)
  );

  // Update 'servings' in the application state
  state.recipe.servings = servings;
};

// Function that when called stores the current state of the 'bookmarks' array inside of 'state' Object in browsers local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Function for clearing bookmarks (dev only)
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// Function for adding a bookmark
export const addBookmark = function (recipe) {
  // Adding the passed 'recipe' to the 'bookmarks' array in application 'state'
  state.bookmarks.push(recipe);

  // Marking the passed 'recipe' as a bookmark, so if the passed 'recipe' is the same as the loaded recipe add the 'bookmarked' property to the 'recipe' Object inside of the 'state' Object and set it to 'true'
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Saving the bookmarks in local storage
  persistBookmarks();
};

// Function for deleting an existing bookmark
export const deleteBookmark = function (id) {
  // Finding the index of the 'recipe' that has the same 'id' as the passed 'id'
  const index = state.bookmarks.findIndex(element => element.id === id);
  // Removing the element with the calculated index and remove only that element
  state.bookmarks.splice(index, 1);

  // Set the 'bookmarked' property of the current recipe to false
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Saving the bookmarks in local storage
  persistBookmarks();
};

// Initialization function for the 'model' component
const init = function () {
  // Taking the 'bookmarks' out of the local storage and saving it in to the 'storage' variable
  const storage = localStorage.getItem('bookmarks');
  // Only if 'storage' is not empty set the 'bookmarks' array in 'state' object to that 'storage' variable
  if (storage) state.bookmarks = JSON.parse(storage);
};

// Function for uploading the recipe to the API
export const uploadRecipe = async function (newRecipe) {
  try {
    // #1 Formating the data from recieved from the form

    // #1.1 Formating the inputed ingredients

    // Converting the inputed recipe from an object to an array of arrays.
    const ingredients = Object.entries(newRecipe)
      // By filtering the array we can take only the elements with the first element that starts with 'ingredient' and the second element that is not empty.
      .filter(entry =>
        entry[0].startsWith('ingredient') && entry[1] !== '' ? entry : null
      )
      // We are then calling the 'map' method so we can automatically return to the 'ingredients' variable. What we are returning is a new object for each 'ingredient' in an array
      .map(ingredient => {
        const ingredientsArray = ingredient[1]
          // Converting a single array element in to multiple elements
          .split(',')
          // Removing white space from each array element
          .map(element => element.trim());

        // Throwing an error if the format is not correct
        if (ingredientsArray.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format.'
          );

        // Destructuring for easier variable defining
        const [quantity, unit, description] = ingredientsArray;

        // Returning an object
        return {
          // If quantity exsists convert the value to a number and set the Object property to that value, if not set it to 'null'
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Sending data to the API and storing the recieved data
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    // Storing the recieved data in the application 'state' Object
    state.recipe = createRecipeObject(data);

    // Automatically bookmarking the newly created recipe
    addBookmark(state.recipe);
  } catch (error) {
    // Re-throwing the error so it can be caught in the 'controller' module
    throw error;
  }
};

// clearBookmarks();

// Initializing the 'model' component
init();
