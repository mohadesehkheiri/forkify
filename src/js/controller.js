import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import RecipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';

import PaginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';


// https://forkify-api.herokuapp.com/v2


if (module.hot) {
  module.hot.accept();
}

// ***show recipe
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
   

    RecipeView.renderSpinner();

    // 0 update result view to mark selected search result
    ResultsView.update(model.loadSearchResultsPage());

    // 1 Updating bookmarks view
    // bookmarkView.update(model.state.bookmarks);
    

    // 2 load recipe
    await model.loadRecipe(id);

    //3 rendering recipe
    RecipeView.render(model.state.recipe);
    console.log('true ooo');
  } catch (err) {
    RecipeView.renderError();
    console.log(err);
  }
};

// search resault
const controlSearchResault = async function () {
  try {
    ResultsView.renderSpinner();
    // 1 get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2 load search resault
    await model.loadSearchResults(query);

    // 3 render search resault
    ResultsView.render(model.loadSearchResultsPage());

    // render pagination
    PaginationView.render(model.state.search);

  } catch (err) {
    console.log(err);
  }
};

// pagination
const controlPagination = function (goToPage) {
  // 1 render search resault
  ResultsView.render(model.loadSearchResultsPage(goToPage));

  // 2 render pagination
  PaginationView.render(model.state.search);
}


// update serving

const controlServing = function (newServing) {
  // update recipe in state
  model.updateServings(newServing);

  // update the view recipe
  RecipeView.update(model.state.recipe);
}


// controlAddBookmak
const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);


  // 2) Update recipe view
  RecipeView.update(model.state.recipe);

  // 3 render bookmark
  bookmarkView.render(model.state.bookmarks);
}

const controlBookmark = function () {
  console.log(model.state.bookmarks);
  bookmarkView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // render recipe
    RecipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // render bookmark
    bookmarkView.render(model.state.bookmarks);

    // change id
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('💥', err);
    addRecipeView.renderError(err.message);
  }
}

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServing(controlServing);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResault);
  PaginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
  