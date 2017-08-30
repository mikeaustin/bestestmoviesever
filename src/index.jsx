import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";
import smoothScroll from "smoothscroll";
import UAParser from "ua-parser-js";

import rawMovies from "./movies";
import rawDirectors from "./directors";
import rawCategories from "./categories";

import Menu from "./Menu";
import MovieList from "./MovieList";
import Help from "./Help";
import Search from "./Search";

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

    this.directors = this.props.movies.reduce((map, movie) => {
      return movie.get("directors").reduce((map, directorId) => map.update(directorId, (movieIds = Immutable.List()) => movieIds.push(movie.get("id"))), map);
    }, Immutable.Map());

    // this.directors2 = this.props.movies.reduce((map, movie) => {
    //   return movie.get("directors").map(directorId => map.update(directors.get(directorId), (count = 0) => count + 1));
    // }, Immutable.Map());

    this.directorsSortedByCount = this.directors.sortBy((movieIds, director) => -movieIds.size);

    this.state = {
      movies:        this.props.movies.sort(byReleased(descending)(byTitle())).map(withIndex),
      sortOrder:     SortOrder.DESCENDING,
      watchlistIds:  Immutable.Set(JSON.parse(localStorage.getItem("watchlistIds"))),
      favoriteIds:   Immutable.Set(JSON.parse(localStorage.getItem("favoriteIds"))),
      watchedIds:    Immutable.Set(JSON.parse(localStorage.getItem("watchedIds"))),
      categoryIds:   Immutable.Set(),
      filteredIds:   Immutable.Set(),
      directorIds:   Immutable.Set(),
      showHelp:      !JSON.parse(localStorage.getItem("seenHelp")),
      showMenu:      false,
      showSearch:    false,
      showWatchlist: false,
      showFavorites: false,
      showUnwatched: false,
      showDirectors: false,
      selectedIndex: 0
    };

    localStorage.setItem("seenHelp", true);
  }

  //
  // Lifecycle
  //

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("touchmove", this.handleScroll, {passive: false});

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
    console.log(">>>", event.keyCode);

    if (event.keyCode !== 32) {
      this.setState({
        showHelp: false
      });
    }

    if (event.keyCode === KeyCode.ESCAPE) {
      this.setState({
        showMenu: false,
        showSearch: false,
      });

      return;
    }

    if (this.state.showSearch) {
      return;
    }

    if (!this.state.showSearch) {
      for (var prop in KeyCode) {
       if (KeyCode[prop] === event.keyCode) {
          event.preventDefault();
          event.stopPropagation();
       }
      }
    }

    if (this.state.showMenu) {
      switch (event.keyCode) {
        case 89: case KeyCode.NUMBER_1: return this.handleShowUnwatched();
        case 74: case KeyCode.NUMBER_2: return this.handleShowWatchlist();
        case 85: case KeyCode.NUMBER_3: return this.handleShowFavorites();
      }
    }

    switch (event.keyCode) {
      case 76: case KeyCode.TAB:      return this.handleToggleMenu();
      case  0: case KeyCode.ENTER:    return this.handleShowSearch();
      case 32:                        return this.handleToggleHelp();
      case KeyCode.ARROW_LEFT:        return this.updateState(NavigationActions.moveLeft);
      case KeyCode.ARROW_RIGHT:       return this.updateState(NavigationActions.moveRight);
      case KeyCode.ARROW_UP:          return this.updateState(NavigationActions.moveUp(this.allItems, this.selectedItem, this.maxOffsetLeft));
      case KeyCode.ARROW_DOWN:        return this.updateState(NavigationActions.moveDown(this.allItems, this.selectedItem, this.minOffsetLeft));
      case 89: case KeyCode.NUMBER_1: return this.handleToggleWatched(Number(this.selectedItem.dataset.id));
      case 74: case KeyCode.NUMBER_2: return this.handleToggleWatchlist(Number(this.selectedItem.dataset.id));
      case 85: case KeyCode.NUMBER_3: return this.handleToggleFavorite(Number(this.selectedItem.dataset.id));
    }
  }

  handleScroll = event => {
    if (this.state.showMenu || this.state.showSearch) {
      if (event.target.className === "action") {
        console.log(event);

        const offsetParent = event.target.offsetParent;
        const clientY = event.touches ? event.touches[0].clientY : 0;
        const deltaY = event.touches ? this.clientY - clientY : event.deltaY;

        if ((deltaY > 0 && offsetParent.offsetHeight + offsetParent.scrollTop >= offsetParent.scrollHeight) ||
             deltaY < 0 && offsetParent.scrollTop === 0) {
          event.preventDefault();
          event.stopPropagation();
        }

        this.clientY = clientY;
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
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
    this.setState(state => ({
      showMenu: !state.showMenu,
      showSearch: false,
    }));
  }

  handleToggleHelp = event => {
    this.setState(state => ({
      showHelp: !state.showHelp,
      showMenu: false,
    }));
  }

  handleShowSearch = event => {
    this.setState(state => {
      return {
        showSearch: true,
        showMenu: false,
      };
    });
  }

  handleHideMenu = () => {
    this.setState({
      showMenu: false
    });
  }

  handleHideSearch = () => {
    this.setState({
      showSearch: false
    });
  }

  handleHideHelp = () => {
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
  handleShowMovieIds = movieIds => this.updateState(state => ({filteredIds: movieIds, showSearch: false, selectedIndex: 0}))

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
                            !newState.filteredIds.equals(state.filteredIds) ||
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

    const onWatchlist  = movie => state.watchlistIds.includes(movie.get("id"));
    const onFavorites  = movie => state.favoriteIds.includes(movie.get("id"));
    const onUnwatched  = movie => !state.watchedIds.includes(movie.get("id"));
    const onCategories = movie => movie.get("categories").isSuperset(state.categoryIds);
    const onDirectors  = movie => movie.get("directors").isSuperset(state.directorIds);
    const onFilter     = movie => state.filteredIds.includes(movie.get("id"));

    var onCriteria = [
      [state.showWatchlist, onWatchlist],
      [state.showFavorites, onFavorites],
      [state.showUnwatched, onUnwatched],
      [!state.categoryIds.isEmpty(), onCategories],
      [!state.directorIds.isEmpty(), onDirectors],
      [!state.filteredIds.isEmpty(), onFilter],
    ].filter(pair => pair[0]).map(pair => pair[1]);

    const sortOrder = state.sortOrder === SortOrder.ASCENDING ? ascending : descending;

    // const grouped = this.props.movies.groupBy(combineEvery(onCriteria));
    // const visible = grouped.has(true) ? grouped.get(true) : Immutable.List();
    // const hidden = grouped.has(false) ? grouped.get(false) : Immutable.List();

    // return visible.sort(byReleased(sortOrder)(byTitle())).map(movie => movie.set("hidden", false)).concat(hidden.map(movie => movie.set("hidden", true))).map(withIndex);

    //return this.props.movies.filter(combineEvery([onWatchlist, onFavorites, onUnwatched, onCategories, onDirectors])).sort(byReleased(sortOrder)(byTitle())).map(withIndex);
    return this.props.movies.filter(combineEvery(onCriteria)).sort(byReleased(sortOrder)(byTitle())).map(withIndex);
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
        <div className="director bold" style={{fontSize: 15, marginBottom: "16px", cursor: "pointer"}} data-text="Reset Filter &mdash;" onClick={this.handleChangeDirector(null)}>Reset Filter &mdash; All Directors</div>
        {this.directorsSortedByCount.entrySeq().map(([directorId, movieIds]) => (
          <div key={directorId} style={{breakInside: "avoid"}}>
            <div className="director bold" style={{fontSize: 15, marginBottom: "6px", cursor: "pointer"}} data-text={rawDirectors.get(directorId)} onClick={this.handleChangeDirector(directorId)}>{rawDirectors.get(directorId)} ({movieIds.size})</div>
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
      <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}} data-user-agent={navigator.userAgent}>
        <Help isOpen={this.state.showHelp} onDismiss={this.handleHideHelp}/>
        <Menu categories={this.props.categories} categoryIds={this.state.categoryIds} isOpen={this.state.showMenu}
              sortOrder={this.state.sortOrder} showWatchlist={this.state.showWatchlist} showFavorites={this.state.showFavorites} showUnwatched={this.state.showUnwatched}
              onSortYearAscending={this.handleSortYearAscending} onSortYearDescending={this.handleSortYearDescending}
              onShowWatchlist={this.handleShowWatchlist} onShowFavorites={this.handleShowFavorites} onShowUnwatched={this.handleShowUnwatched}
              onChangeCategory={this.handleChangeCategory} onHideMenu={this.handleHideMenu} onShowHelp={this.handleToggleHelp} />
        <header>
          <div id="menu-button" className={selectedState("showMenu")} style={{position: "absolute", display: "flex", alignItems: "center", left: 0, top: 0, height: 50, padding: "0 15px", paddingTop: 2, cursor: "pointer"}} onClick={this.handleToggleMenu}>
            <img src="icons/menu-button.svg" height="25" />
          </div>

          <Search isOpen={this.state.showSearch} movies={this.state.movies} directors={rawDirectors} onShowSearch={this.handleShowSearch} onHideSearch={this.handleHideSearch} onShowMovieIds={this.handleShowMovieIds} />

          {/*<div id="search-button" style={{position: "absolute", display: "flex", alignItems: "center", right: 0, top: 0, height: 50, padding: "0 15px", paddingTop: 2, cursor: "pointer"}}
               ref={element => this.searchButton = element} onClick={this.handleToggleSearch}>
            <img src="icons/search.svg" height="25" />
          </div>*/}
          <div className="center" style={{paddingTop: 5, cursor: "pointer"}} onClick={this.handleToggleDirectors}>
            <span className="title" style={{fontSize: 25, fontWeight: 800}}>
              <img src="icons/down-arrow-1.svg" height="10" style={{position: "relative", top: -4}} /> Movies
            </span>
            &nbsp;<span className="count" style={{fontSize: 25}}>({this.state.movies.size})</span>
          </div>
        </header>
        {this.state.showDirectors ? directorsList : (
          <MovieList movies={this.state.movies} directors={rawDirectors} watchlistIds={this.state.watchlistIds} favoriteIds={this.state.favoriteIds} watchedIds={this.state.watchedIds} selectedIndex={this.state.selectedIndex}
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

window.movies = movies;

ReactDOM.render(
  <App movies={movies} categories={categories} />,
  document.getElementById("root")
);
