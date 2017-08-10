import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";
import smoothScroll from "smoothscroll";

import movies from "./movies";
import directors from "./directors";
import categories from "./categories";

import Menu from "./Menu";
import MovieList from "./MovieList";

import { ListReducer, NavigationActions, FilterActions, ToggleActions, KeyCode, SortOrder, selectedClass, combineEvery } from "./utils";


const always     = x => (a, b) => x;
const comparator = f => (next = always(0), x, y) => (a, b) => f(a, b) ? -1 : f(b, a) ? 1 : next(x, y);
const ascending  = (next, x, y) => comparator((a, b) => a < b)(next, x, y);
const descending = (next, x, y) => comparator((a, b) => a > b)(next, x, y);
const byReleased = order => next => (a, b) => order(next, a, b)(a.released, b.released);
const byTitle    = next => (a, b) => ascending(next)(a.title, b.title);
const withIndex  = (movie, index) => ({ ...movie, index: index });


class App extends React.PureComponent {

  constructor(props) {
    super(props);

    this.evenCategories = this.props.categories.sortBy((genre, id) => id).filter((genre, id) => id % 2 == 0).entrySeq();
    this.oddCategories = this.props.categories.sortBy((genre, id) => id).filter((genre, id) => id % 2 != 0).set(-1, null).entrySeq();

    this.directors2 = this.props.movies.reduce((map, movie) => {
      return map.update(movie.directors ? directors.get(movie.directors[0]) : "Unknown", (count = 0) => count + 1)
    }, Immutable.Map());

    this.directorsSortedByCount = this.directors2.sortBy((count, director) => -count);

    this.state = {
      movies: this.props.movies.sort(byReleased(descending)(byTitle())).map(withIndex),
      sortOrder: SortOrder.DESCENDING,
      watchlistIds: Immutable.Set(JSON.parse(localStorage.getItem("watchlistIds"))),
      favoriteIds: Immutable.Set(JSON.parse(localStorage.getItem("favoriteIds"))),
      categoryIds: Immutable.Set(),
      showMenu: false,
      showWatchlist: false,
      showFavorites: false,
      selectedIndex: 0
    };
  }

  //
  // Lifecycle
  //

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);

    this.selectedItem = document.querySelector(".movies > li.selected");
    this.allItems = Immutable.List(document.querySelectorAll(".movies > li"));
    this.minOffsetLeft = this.allItems.first().offsetLeft;
    this.maxOffsetLeft = this.allItems.reduce((max, item) => Math.max(item.offsetLeft, max), 0);
  }

  componentDidUpdate() {
    this.selectedItem = document.querySelector(".movies > li.selected");
    this.allItems = Immutable.List(document.querySelectorAll(".movies > li"));
    this.minOffsetLeft = this.allItems.first().offsetLeft;
    this.maxOffsetLeft = this.allItems.reduce((max, item) => Math.max(item.offsetLeft, max), 0);
  }

  //
  // Navigation Handlers
  //

  handleKeyDown = event => {
    //console.log(event.keyCode);

    for (var prop in KeyCode) {
      if (KeyCode[prop] === event.keyCode) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    switch (event.keyCode) {
      case KeyCode.ARROW_LEFT: return this.refreshMovies(NavigationActions.moveLeft);
      case KeyCode.ARROW_RIGHT: return this.refreshMovies(NavigationActions.moveRight);
      case KeyCode.ARROW_UP: return this.refreshMovies(NavigationActions.moveUp(this.allItems, this.selectedItem, this.maxOffsetLeft));
      case KeyCode.ARROW_DOWN: return this.refreshMovies(NavigationActions.moveDown(this.allItems, this.selectedItem, this.minOffsetLeft));
      case KeyCode.SPACE: return this.handleToggleFavorite(Number(this.selectedItem.dataset.id));
    }
  }

  handleSelectIndex = index => {
    this.setState({
      selectedIndex: index
    });
  }

  //
  // Menu Handlers
  //

  handleToggleMenu = event => {
    event.preventDefault();
    event.stopPropagation();

    this.setState(state => ({
      showMenu: !state.showMenu
    }));
  }

  handleHideMenu = () => {
    this.setState({
      showMenu: false
    });
  }

  //
  // Toggle Handlers
  //

  handleToggleWatchlist = movieId => this.refreshMovies(ToggleActions.toggleWatchlist(movieId))
  handleToggleFavorite = movieId => this.refreshMovies(ToggleActions.toggleFavorite(movieId))

  //
  // Filter Handlers
  //

  handleSortYearAscending = () => this.refreshMovies(FilterActions.sortYearAscending)
  handleSortYearDescending = () => this.refreshMovies(FilterActions.sortYearDescending)
  handleShowWatchlist = () => this.refreshMovies(FilterActions.showWatchlist)
  handleShowFavorites = () => this.refreshMovies(FilterActions.showFavorites)
  handleChangeCategory = categoryId => this.refreshMovies(FilterActions.changeCategory(categoryId))

  handleAppTouchEnd = event => {
    // this.setState({
    //   showMenu: false
    // });
  }

  //
  // State Management
  //

  refreshMovies(reducer) {
    console.log("refreshMovies()");

    this.setState(state => {
      const newState = { ...state, ...reducer(state) };

      const onWatchlist  = movie => !newState.showWatchlist || newState.watchlistIds.includes(movie.id);
      const onFavorites  = movie => !newState.showFavorites || newState.favoriteIds.includes(movie.id);
      const onCategories = movie => newState.categoryIds.isEmpty() || Immutable.Set(movie.categories).isSuperset(newState.categoryIds)

      const sortOrder = newState.sortOrder === SortOrder.ASCENDING ? ascending : descending;

      return {
        ...newState,
        movies: this.props.movies.filter(combineEvery([onWatchlist, onFavorites, onCategories])).sort(byReleased(sortOrder)(byTitle())).map(withIndex)
      }
    }, () => {
      if (this.state.selectedIndex === 0) {
        smoothScroll(0);
      }
    });
  }

  //
  // Rendering
  //

  render() {
    console.log("App#render()");

    const selectedState = selectedClass(arg => this.state[arg]);
    const selectedCategory = selectedClass(arg => this.state.categoryIds.includes(arg));
    const selectedSortOrder = selectedClass(arg => this.state.sortOrder == arg);

    return (
      <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}} onTouchMove={this.handleAppTouchEnd} onTouchEnd={this.handleAppTouchEnd}>
        <Menu categories={this.props.categories} categoryIds={this.state.categoryIds} isOpen={this.state.showMenu}
              sortOrder={this.state.sortOrder} showWatchlist={this.state.showWatchlist} showFavorites={this.state.showFavorites}
              onSortYearAscending={this.handleSortYearAscending} onSortYearDescending={this.handleSortYearDescending}
              onShowWatchlist={this.handleShowWatchlist} onShowFavorites={this.handleShowFavorites}
              onChangeCategory={this.handleChangeCategory} onHideMenu={this.handleHideMenu} />
        <header style={{display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: 0, right: 0, left: 0, height: 50, background: "hsl(0, 0%, 10%)", outline: "1px solid hsla(0, 0%, 20%, 1.0)", zIndex: 1000, boxShadow: "0 1px 10px hsl(0, 0%, 0%)"}}>
          <div style={{position: "absolute", display: "flex", alignItems: "center", left: 0, top: 0, height: 50, padding: "0 20px", cursor: "pointer", zIndex: 1001}} onMouseDown={this.handleToggleMenu}>
            <img src="icons/menu-button.svg" height="25" />
          </div>
          <div style={{paddingTop: 4}}>
            <span className="title" style={{fontSize: 25, fontWeight: 800}}>Movies</span> <span className="count" style={{fontSize: 25}}>({this.state.movies.size})</span>
          </div>
        </header>
        <MovieList movies={this.state.movies} directors={directors} watchlistIds={this.state.watchlistIds} favoriteIds={this.state.favoriteIds} selectedIndex={this.state.selectedIndex}
                   onSelectIndex={this.handleSelectIndex} onToggleWatchlist={this.handleToggleWatchlist} onToggleFavorite={this.handleToggleFavorite} />
        <footer style={{display: "flex", justifyContent: "center", position: "fixed", bottom: -51, right: 0, left: 0, height: "50px", background: "hsl(0, 0%, 10%)", outline: "1px solid hsla(0, 0%, 20%, 1.0)", zIndex: 1000, boxShadow: "0 -1px 10px hsl(0, 0%, 0%)"}} />
      </div>
    );
  }

}

ReactDOM.render(
  <App movies={Immutable.List(movies)} categories={categories} />,
  document.getElementById("root")
);
