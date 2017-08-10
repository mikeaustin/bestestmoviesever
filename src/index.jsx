import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";
import smoothScroll from "smoothscroll";

import movies from "./movies";
import directors from "./directors";
import categories from "./categories";

import Menu from "./Menu";
import MovieList from "./MovieList";

import { ListReducer, FilterActions, KeyCode, SortOrder, selectedClass, combineEvery } from "./utils";


const always     = x => (a, b) => x;
const comparator = f => (next = always(0), x, y) => (a, b) => f(a, b) ? -1 : f(b, a) ? 1 : next(x, y);
const ascending  = (next, x, y) => comparator((a, b) => a < b)(next, x, y);
const descending = (next, x, y) => comparator((a, b) => a > b)(next, x, y);
const byReleased = order => next => (a, b) => order(next, a, b)(a.released, b.released);
const byTitle    = next => (a, b) => ascending(next)(a.title, b.title);
const withIndex  = (movie, index) => {
  return { index: index, id: movie.id, title: movie.title, image: movie.image, released: movie.released, directors: movie.directors, categories: movie.categories };
};


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
      selectedIndex: 0,
      categoryIds: Immutable.Set(),
      sortOrder: SortOrder.DESCENDING,
      favoriteIds: Immutable.Set(JSON.parse(localStorage.getItem("favoriteIds"))),
      watchlistIds: Immutable.Set(JSON.parse(localStorage.getItem("watchlistIds"))),
      showMenu: false,
      showWatchlist: false,
      showFavorites: false
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

  handleKeyDown = (event) => {
    //console.log(event.keyCode);

    for (var prop in KeyCode) {
      if (KeyCode[prop] === event.keyCode) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    const offset = (() => {
      if (event.keyCode === KeyCode.ARROW_RIGHT && this.state.selectedIndex < this.state.movies.size - 1) {
        return this.state.selectedIndex + 1;
      } else if (event.keyCode === KeyCode.ARROW_LEFT && this.state.selectedIndex > 0) {
        return this.state.selectedIndex - 1;
      } else if (event.keyCode === KeyCode.SPACE) {
        const selectedMovie = this.state.movies.find(movie => movie.index === this.state.selectedIndex);

        this.handleToggleFavorite(selectedMovie.id);
      } else if (event.keyCode === KeyCode.ARROW_DOWN) {
        const nextRowItems = new ListReducer(this.allItems.toSeq())
          .skipWhile(item => Number(item.dataset.index) !== this.state.selectedIndex)
          .take(1).skipWhile(item => item.offsetLeft > this.selectedItem.offsetLeft)
          .take(1).takeWhile(item => item.offsetLeft <= this.selectedItem.offsetLeft && item.offsetLeft !== this.minOffsetLeft);

        if (!nextRowItems.isEmpty()) {
          return Number(nextRowItems.last().dataset.index);
        }
      } else if (event.keyCode === KeyCode.ARROW_UP) {
        const nextRowItems = new ListReducer(this.allItems.toSeq().reverse())
          .skipWhile(item => Number(item.dataset.index) !== this.state.selectedIndex)
          .skip(1).skipWhile(item => item.offsetLeft < this.selectedItem.offsetLeft)
          .take(1).takeWhile(item => item.offsetLeft >= this.selectedItem.offsetLeft && item.offsetLeft !== this.maxOffsetLeft);

        if (!nextRowItems.isEmpty()) {
          return Number(nextRowItems.last().dataset.index);
        }
      }

      return null;
    })();

    if (offset !== null) {
      this.setState({
        selectedIndex: offset
      });
    }
  }

  handleSelectIndex = (index) => {
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

  handleToggleWatchlist = movieId => {
    this.refreshList(state => {
      const watchlistIds = state.watchlistIds.includes(movieId) ? state.watchlistIds.remove(movieId) : state.watchlistIds.add(movieId);

      localStorage.setItem("watchlistIds", JSON.stringify(watchlistIds.toArray()));

      return {
        watchlistIds: watchlistIds,
      };
    });
  }

  handleToggleFavorite = movieId => {
    this.refreshList(state => {
      const favoriteIds = state.favoriteIds.includes(movieId) ? state.favoriteIds.remove(movieId) : state.favoriteIds.add(movieId);

      localStorage.setItem("favoriteIds", JSON.stringify(favoriteIds.toArray()));

      return {
        favoriteIds: favoriteIds,
      };
    });
  }

  handleAppTouchEnd = event => {
    // this.setState({
    //   showMenu: false
    // });
  }

  //
  // Filter Handlers
  //

  handleSortYearAscending = () => this.refreshList(FilterActions.sortYearAscending)
  handleSortYearDescending = () => this.refreshList(FilterActions.sortYearDescending)
  handleShowWatchlist = () => this.refreshList(FilterActions.showWatchlist)
  handleShowFavorites = () => this.refreshList(FilterActions.showFavorites)
  handleChangeCategory = categoryId => this.refreshList(FilterActions.changeCategory(categoryId))

  //
  // State Management
  //

  refreshList(reducer) {
    console.log("refreshList()");

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

    const selectedMovie = this.state.movies.find(movie => movie.index === this.state.selectedIndex);

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
