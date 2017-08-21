import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";
import smoothScroll from "smoothscroll";

import rawMovies from "./movies";
import directors from "./directors";
import rawCategories from "./categories";

import Menu from "./Menu";
import MovieList from "./MovieList";
import Help from "./Help";

import { ListReducer, NavigationActions, FilterActions, ToggleActions, KeyCode, SortOrder, selectedClass, combineEvery } from "./utils";


const always     = x => (a, b) => x;
const comparator = f => (next = always(0), x, y) => (a, b) => f(a, b) ? -1 : f(b, a) ? 1 : next(x, y);
const ascending  = (next, x, y) => comparator((a, b) => a < b)(next, x, y);
const descending = (next, x, y) => comparator((a, b) => a > b)(next, x, y);
const byReleased = order => next => (a, b) => order(next, a, b)(a.get("released"), b.get("released"));
const byTitle    = next => (a, b) => ascending(next)(a.get("title"), b.get("title"));
const withIndex  = (movie, index) => movie.set("index", index);


class App extends React.PureComponent {

  constructor(props) {
    super(props);

    this.evenCategories = this.props.categories.sortBy((genre, id) => id).filter((genre, id) => id % 2 == 0).entrySeq();
    this.oddCategories = this.props.categories.sortBy((genre, id) => id).filter((genre, id) => id % 2 != 0).set(-1, null).entrySeq();

    // this.directors2 = this.props.movies.reduce((map, movie) => {
    //   return map.update(directors.get(movie.get("directors").get(0)), (count = 0) => count + 1)
    // }, Immutable.Map());

    this.directors2 = this.props.movies.reduce((map, movie) => {
      return movie.get("directors").reduce((map, directorId) => map.update(directorId, (movieIds = Immutable.List()) => movieIds.push(movie.get("id"))), map);
    }, Immutable.Map());

    // this.directors2 = this.props.movies.reduce((map, movie) => {
    //   return movie.get("directors").map(directorId => map.update(directors.get(directorId), (count = 0) => count + 1));
    // }, Immutable.Map());

    console.log(this.directors2);

    this.directorsSortedByCount = this.directors2.sortBy((movieIds, director) => -movieIds.size);

    this.state = {
      movies:        this.props.movies.sort(byReleased(descending)(byTitle())).map(withIndex),
      sortOrder:     SortOrder.DESCENDING,
      watchlistIds:  Immutable.Set(JSON.parse(localStorage.getItem("watchlistIds"))),
      favoriteIds:   Immutable.Set(JSON.parse(localStorage.getItem("favoriteIds"))),
      watchedIds:    Immutable.Set(JSON.parse(localStorage.getItem("watchedIds"))),
      categoryIds:   Immutable.Set(),
      directorIds:   Immutable.Set(),
      showHelp:      true,
      showMenu:      false,
      showWatchlist: false,
      showFavorites: false,
      showUnwatched: false,
      showDirectors: false,
      selectedIndex: 0
    };
  }

  //
  // Lifecycle
  //

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);

    this.selectedItem = document.querySelector(".movies > li.selected");

    this.refreshDOMCache();
    this.movies = this.state.movies;
  }

  componentDidUpdate() {
    this.selectedItem = document.querySelector(".movies > li.selected");

    if (!this.movies.equals(this.state.movies)) {
      this.refreshDOMCache();
      this.movies = this.state.movies;
    }
  }

  refreshDOMCache() {
    console.log("refreshDOMCache()");

    this.allItems = Immutable.List(document.querySelectorAll(".movies > li"));

    if (!this.allItems.isEmpty()) {
      this.minOffsetLeft = this.allItems.first().offsetLeft;
      this.maxOffsetLeft = this.allItems.skip(1).takeWhile(item => item.offsetLeft > this.allItems.first().offsetLeft)
                                                .reduce((max, item) => Math.max(item.offsetLeft, max), this.allItems.first().offsetLeft);
    }
  }

  //
  // Navigation Handlers
  //

  handleKeyDown = event => {
    console.log(event.keyCode);

    for (var prop in KeyCode) {
      if (KeyCode[prop] === event.keyCode) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    switch (event.keyCode) {
      case KeyCode.ARROW_LEFT:  return this.updateState(NavigationActions.moveLeft);
      case KeyCode.ARROW_RIGHT: return this.updateState(NavigationActions.moveRight);
      case KeyCode.ARROW_UP:    return this.updateState(NavigationActions.moveUp(this.allItems, this.selectedItem, this.maxOffsetLeft));
      case KeyCode.ARROW_DOWN:  return this.updateState(NavigationActions.moveDown(this.allItems, this.selectedItem, this.minOffsetLeft));
      case KeyCode.NUMBER_1:    return this.handleToggleWatched(Number(this.selectedItem.dataset.id));
      case KeyCode.NUMBER_2:    return this.handleToggleWatchlist(Number(this.selectedItem.dataset.id));
      case KeyCode.NUMBER_3:    return this.handleToggleFavorite(Number(this.selectedItem.dataset.id));
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
    console.log("handleToggleMenu()");

    //event.preventDefault();
    //event.stopPropagation();

    this.setState(state => ({
      showMenu: !state.showMenu
    }));
  }

  handleToggleHelp = event => {
    //event.preventDefault();
    //event.stopPropagation();

    this.setState(state => ({
      showHelp: !state.showHelp
    }));
  }

  handleHideMenu = () => {
    this.setState({
      showMenu: false
    });
  }

  handleHideHelp = () => {
    console.log("handleHideHelp()");

    this.setState({
      showHelp: false
    });
  }

  //
  // Toggle Handlers
  //

  handleToggleWatchlist = movieId => this.updateState(ToggleActions.toggleWatchlist(movieId))
  handleToggleFavorite = movieId => this.updateState(ToggleActions.toggleFavorite(movieId))
  handleToggleWatched = movieId => this.updateState(ToggleActions.toggleWatched(movieId))

  //
  // Filter Handlers
  //

  handleSortYearAscending = () => this.updateState(FilterActions.sortYearAscending)
  handleSortYearDescending = () => this.updateState(FilterActions.sortYearDescending)
  handleShowWatchlist = () => this.updateState(FilterActions.showWatchlist)
  handleShowFavorites = () => this.updateState(FilterActions.showFavorites)
  handleShowUnwatched = () => this.updateState(FilterActions.showUnwatched)
  handleChangeCategory = categoryId => this.updateState(FilterActions.changeCategory(categoryId))

  handleToggleDirectors = event => {
    this.setState(state => ({showDirectors: !state.showDirectors}));

    window.scrollTo(0, 0);
  }

  handleChangeDirector = directorId => event => this.updateState(state => ({directorIds: Immutable.Set(directorId !== null ? [directorId] : null), showDirectors: false}));

  //
  // State Management
  //

  updateState(reducer = () => ({})) {
    this.setState(state => {
      const newState = { ...state, ...reducer(state) };

      const shouldRefresh = (newState.showFavorites && !newState.favoriteIds.equals(state.favoriteIds)) || newState.showFavorites !== state.showFavorites ||
                            (newState.showWatchlist && !newState.watchlistIds.equals(state.watchlistIds)) || newState.showWatchlist !== state.showWatchlist ||
                            (newState.showUnwatched && !newState.watchedIds.equals(state.watchedIds)) || newState.showUnwatched !== state.showUnwatched ||
                            !newState.directorIds.equals(state.directorIds) ||
                            newState.sortOrder !== state.sortOrder || !newState.categoryIds.equals(state.categoryIds);

      const movies = shouldRefresh ? this.refreshMovies(newState) : state.movies;

      if (shouldRefresh) {
        smoothScroll(0);
      }

      return {
        ...newState,
        movies: movies,
      };
    });
  }

  refreshMovies(state) {
    console.log("refreshMovies()");

    const onWatchlist  = movie => !state.showWatchlist || state.watchlistIds.includes(movie.get("id"));
    const onFavorites  = movie => !state.showFavorites || state.favoriteIds.includes(movie.get("id"));
    const onUnwatched  = movie => !state.showUnwatched || !state.watchedIds.includes(movie.get("id"));
    const onCategories = movie => state.categoryIds.isEmpty() || movie.get("categories").isSuperset(state.categoryIds);
    const onDirector   = movie => state.directorIds.isEmpty() || movie.get("directors").isSuperset(state.directorIds);

    //console.log(">>>", state.directorIds, state.categoryIds);

    //const onDirector   = movie => console.log(movie.get("directors").toArray(), state.categoryIds.toArray());

    const sortOrder = state.sortOrder === SortOrder.ASCENDING ? ascending : descending;

    return this.props.movies.filter(combineEvery([onWatchlist, onFavorites, onUnwatched, onCategories, onDirector])).sort(byReleased(sortOrder)(byTitle())).map(withIndex);
  }

  //
  // Rendering
  //

  render() {
    console.log("App#render()");

    const selectedState = selectedClass(arg => this.state[arg]);
    const selectedCategory = selectedClass(arg => this.state.categoryIds.includes(arg));
    const selectedSortOrder = selectedClass(arg => this.state.sortOrder == arg);

    const directorsList = this.state.showDirectors ? (
      <div id="directors" style={{padding: "75px 20px 20px 20px", columnWidth: 300}}>
        <div className="director bold" style={{fontSize: 15, marginBottom: "16px", cursor: "pointer"}} data-text="Reset Filter &mdash;" onMouseDown={this.handleChangeDirector(null)}>Reset Filter &mdash; All Directors</div>
        {this.directorsSortedByCount.entrySeq().map(([directorId, movieIds]) => (
          <div key={directorId} style={{breakInside: "avoid"}}>
            <div className="director bold" style={{fontSize: 15, marginBottom: "6px", cursor: "pointer"}} data-text={directors.get(directorId)} onMouseDown={this.handleChangeDirector(directorId)}>{directors.get(directorId)} ({movieIds.size})</div>
            <div style={{marginBottom: 15}}>
              {movieIds.map(movieId => (
                <div key={movieId} style={{margin: "5px 0", marginLeft: 10, fontSize: 15, color: "hsl(0, 0%, 60%)"}}>{movies2.get(movieId).get("title")} &mdash; {movies2.get(movieId).get("released")}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ) : null;

    return (
      <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
        <Help isOpen={this.state.showHelp} onDismiss={this.handleHideHelp}/>
        <Menu categories={this.props.categories} categoryIds={this.state.categoryIds} isOpen={this.state.showMenu}
              sortOrder={this.state.sortOrder} showWatchlist={this.state.showWatchlist} showFavorites={this.state.showFavorites} showUnwatched={this.state.showUnwatched}
              onSortYearAscending={this.handleSortYearAscending} onSortYearDescending={this.handleSortYearDescending}
              onShowWatchlist={this.handleShowWatchlist} onShowFavorites={this.handleShowFavorites} onShowUnwatched={this.handleShowUnwatched}
              onChangeCategory={this.handleChangeCategory} onHideMenu={this.handleHideMenu} />
        <header>
          <div id="menu-button" className={selectedState("showMenu")} style={{position: "absolute", display: "flex", alignItems: "center", left: 0, top: 0, height: 50, padding: "0 20px", paddingTop: 2, cursor: "pointer"}} onMouseDown={this.handleToggleMenu}>
            <img src="icons/menu-button.svg" height="25" />
          </div>
          <div id="help-button" style={{position: "absolute", display: "flex", alignItems: "center", right: 0, top: 0, height: 50, padding: "0 20px", paddingTop: 2, cursor: "pointer"}} onMouseDown={this.handleToggleHelp}>
            <img src="icons/question-mark.svg" height="25" />
          </div>
          <div style={{paddingTop: 5, cursor: "pointer"}} onMouseDown={this.handleToggleDirectors}>
            <span className="title" style={{fontSize: 25, fontWeight: 800}}>
              <img src="icons/down-arrow-1.svg" height="10" style={{position: "relative", top: -4}} /> Movies
            </span>
            &nbsp;<span className="count" style={{fontSize: 25}}>({this.state.movies.size})</span>
          </div>
        </header>
        {this.state.showDirectors ? directorsList : (
          <MovieList movies={this.state.movies} directors={directors} watchlistIds={this.state.watchlistIds} favoriteIds={this.state.favoriteIds} watchedIds={this.state.watchedIds} selectedIndex={this.state.selectedIndex}
                     onSelectIndex={this.handleSelectIndex} onToggleWatchlist={this.handleToggleWatchlist} onToggleFavorite={this.handleToggleFavorite} onToggleWatched={this.handleToggleWatched} />
        )}
        <footer />
      </div>
    );
  }

}

const categories = Immutable.fromJS(rawCategories).reduce((map, item) => map.set(item.get("id"), item.get("name")), Immutable.Map());
const movies = Immutable.fromJS(rawMovies);
const movies2 = Immutable.fromJS(rawMovies).reduce((map, movie) => map.set(movie.get("id"), movie), Immutable.Map());

ReactDOM.render(
  <App movies={movies} categories={categories} />,
  document.getElementById("root")
);
