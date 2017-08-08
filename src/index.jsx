import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";

import smoothScroll from "smoothscroll";

import movies from "./movies";
import directors from "./directors";
import categories from "./categories";

import MovieList from "./MovieList";

import { selectedClass, combineEvery } from "./utils";


class ListReducer {

  constructor(list, acc = Immutable.List()) {
    this.list = list;
    this.acc = acc;
  }

  skipWhile(func) {
    return new ListReducer(this.list.skipWhile(func), this.acc);
  }

  takeWhile(func) {
    return new ListReducer(this.list.skipWhile(func), this.acc.concat(this.list.takeWhile(func)));
  }

  skip(count) {
    return new ListReducer(this.list.skip(count), this.acc);
  }

  take(count) {
    return new ListReducer(this.list.skip(count), this.acc.concat(this.list.take(count)));
  }

  isEmpty() {
    return this.acc.isEmpty();
  }

  last() {
    return this.acc.last();
  }

}

const KeyCode = {
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40
}

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

    this.buildData();

    this.state = {
      movies: this.props.movies.sort(byReleased(descending)(byTitle())).map(withIndex),
      selectedIndex: 0,
      categoryIds: Immutable.Set(),
      sortOrder: descending,
      favoriteIds: Immutable.Set(JSON.parse(localStorage.getItem("favoriteIds"))),
      watchlistIds: Immutable.Set(JSON.parse(localStorage.getItem("watchlistIds"))),
      showMenu: false,
      showWatchlist: false,
      showFavorites: false
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  handleKeyDown = (event) => {
    console.log(KeyboardEvent);

    const offset = (() => {
      if (event.keyCode === KeyCode.ARROW_RIGHT && this.state.selectedIndex < this.props.movies.size - 1) {
        return this.state.selectedIndex + 1;
      } else if (event.keyCode === KeyCode.ARROW_LEFT && this.state.selectedIndex > 0) {
        return this.state.selectedIndex - 1;
      } else if (event.keyCode === KeyCode.ARROW_DOWN) {
        event.stopPropagation();
        event.preventDefault();

        const selectedItem = document.querySelector(".movies > li.selected");
        const allItems = Immutable.List(document.querySelectorAll(".movies > li"));
        const firstItem = allItems.first();

        const nextRowItems = new ListReducer(allItems.toSeq())
          .skip(this.state.selectedIndex + 1)
          .skipWhile(item => item.offsetLeft > selectedItem.offsetLeft)
          .take(1)
          .takeWhile(item => item.offsetLeft <= selectedItem.offsetLeft && item.offsetLeft !== firstItem.offsetLeft);

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

  buildData() {
    this.directors2 = this.props.movies.reduce((map, movie) => {
      return map.update(movie.directors ? directors.get(movie.directors[0]) : "Unknown", (count = 0) => count + 1)
    }, Immutable.Map());

    this.directorsSortedByCount = this.directors2.sortBy((count, director) => -count);
  }

  refreshList() {
    const onWatchlist  = movie => !this.state.showWatchlist || this.state.watchlistIds.includes(movie.id);
    const onFavorites  = movie => !this.state.showFavorites || this.state.favoriteIds.includes(movie.id);
    const onCategories = movie => this.state.categoryIds.isEmpty() || Immutable.Set(movie.categories).isSuperset(this.state.categoryIds)

    this.setState({
      selectedIndex: 0,
      movies: this.props.movies.filter(combineEvery([onWatchlist, onFavorites, onCategories])).sort(byReleased(this.state.sortOrder)(byTitle())).map(withIndex)
    });

    smoothScroll(0);
  }

  handleSortYearAscending = (event) => {
    this.setState(state => ({
      sortOrder: ascending
    }), () => this.refreshList());
  }

  handleSortYearDescending = (event) => {
    this.setState(state => ({
      sortOrder: descending
    }), () => this.refreshList());
  }

  handleChangeCategory(categoryId) {
    return event => {
      const categoryIds = this.state.categoryIds.includes(categoryId) ? this.state.categoryIds.delete(categoryId) : this.state.categoryIds.add(categoryId);

      this.setState(state => ({
        categoryIds: categoryIds,
      }), () => this.refreshList());
    };
  }

  handleShowMenu = (event) => {
    this.setState(state => ({
      showMenu: !state.showMenu
    }));
  }

  handleMouseDown = (event) => {
    // this.setState(state => ({
    //   showMenu: false
    // }));
  }

  handleToggleFavorite = (movieId) => {
    this.setState(state => {
      const favoriteIds = state.favoriteIds.includes(movieId) ? state.favoriteIds.remove(movieId) : state.favoriteIds.add(movieId);

      localStorage.setItem("favoriteIds", JSON.stringify(favoriteIds.toArray()));

      return {
        favoriteIds: favoriteIds,
      };
    }, () => this.state.showFavorites ? this.refreshList() : null);
  }

  handleToggleWatchlist = (movieId) => {
    this.setState(state => {
      const watchlistIds = state.watchlistIds.includes(movieId) ? state.watchlistIds.remove(movieId) : state.watchlistIds.add(movieId);

      localStorage.setItem("watchlistIds", JSON.stringify(watchlistIds.toArray()));

      return {
        watchlistIds: watchlistIds,
      };
    }, () => this.state.showWatchlist ? this.refreshList() : null);
  }

  handleShowFavorites = () => {
      this.setState(state => {
        const showFavorites = !state.showFavorites;

        return {
          showFavorites: showFavorites,
        };
      }, () => this.refreshList());
  }

  handleShowWatchlist = () => {
      this.setState(state => {
        const showWatchlist = !state.showWatchlist;

        return {
          showWatchlist: showWatchlist,
        };
      }, () => this.refreshList());
  }

  render() {
    //console.log("App#render()");

    const selectedMovie = this.state.movies.find(movie => movie.index === this.state.selectedIndex);

    const selectedCategory = selectedClass(arg => this.state.categoryIds.includes(arg));

    return (
      <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}} onMouseDown={this.handleMouseDown}>
        <div className={"menu" + (this.state.showMenu ? " open" : "")} style={{display: "flex", flexDirection: "column", position: "fixed", bottom: 0, left: 0, top: 0, xwidth: "156px", padding: "73px 20px 0 20px", background: "hsla(0, 0%, 0%, 0.9)", zIndex: 1000}}>
          <div style={{position: "fixed", top: 0, zIndex: 1000001}}>Genres</div>

          <h1>Sort By</h1>
          <ul style={{columnCount: 2, columnGap: 20}}>
            <li className={this.state.sortOrder === descending ? "selected" : ""} style={{breakBefore: "column"}} onClick={this.handleSortYearDescending}>&#9634; &nbsp;Year &nbsp;&#8595;</li>
            <li className={this.state.sortOrder === ascending ? "selected" : ""} style={{breakBefore: "column"}} onClick={this.handleSortYearAscending}>&#9634; &nbsp;Year &nbsp;&#8593;</li>
          </ul>
          <h1>Show</h1>
          <ul style={{columnCount: 2, columnGap: 20}}>
            <li className={this.state.showWatchlist ? "selected" : ""} style={{breakBefore: "column"}} onClick={this.handleShowWatchlist}>&#9634; &nbsp;Watchlist</li>
            <li className={this.state.showFavorites ? "selected" : ""} style={{breakBefore: "column"}} onClick={this.handleShowFavorites}>&#9634; &nbsp;Favorites</li>
          </ul>
          <h1>Genres</h1>
          <ul style={{columnCount: 2, columnGap: 20}}>
            <li className={selectedCategory(0)} onClick={this.handleChangeCategory(0)}>&#9634; &nbsp;Sci-Fi</li>
            <li className={selectedCategory(1)} onClick={this.handleChangeCategory(1)}>&#9634; &nbsp;Drama</li>
            <li className={selectedCategory(2)} onClick={this.handleChangeCategory(2)}>&#9634; &nbsp;Comedy</li>
            <li className={selectedCategory(3)} onClick={this.handleChangeCategory(3)}>&#9634; &nbsp;Crime</li>
            <li className={selectedCategory(4)} onClick={this.handleChangeCategory(4)}>&#9634; &nbsp;Action</li>
            <li className={selectedCategory(5)} onClick={this.handleChangeCategory(5)}>&#9634; &nbsp;Thriller</li>
            <li className={selectedCategory(6)} onClick={this.handleChangeCategory(6)}>&#9634; &nbsp;Adventure</li>
            <li className={selectedCategory(7)} onClick={this.handleChangeCategory(7)}>&#9634; &nbsp;Western</li>
            <li className={selectedCategory(8)} onClick={this.handleChangeCategory(8)}>&#9634; &nbsp;Horror</li>
            <li className={selectedCategory(9)} onClick={this.handleChangeCategory(9)}>&#9634; &nbsp;Music</li>
            <li className={selectedCategory(10)} onClick={this.handleChangeCategory(10)}>&#9634; &nbsp;Fantasy</li>
            <li className={selectedCategory(11)} onClick={this.handleChangeCategory(11)}>&#9634; &nbsp;Animation</li>
            <li className={selectedCategory(12)} onClick={this.handleChangeCategory(12)}>&#9634; &nbsp;Romance</li>
            <li className={selectedCategory(13)} onClick={this.handleChangeCategory(13)}>&#9634; &nbsp;Biography</li>
            <li className={selectedCategory(14)} onClick={this.handleChangeCategory(14)}>&#9634; &nbsp;Mystery</li>
            <li className={selectedCategory(15)} onClick={this.handleChangeCategory(15)}>&#9634; &nbsp;Family</li>
            <li className={selectedCategory(16)} onClick={this.handleChangeCategory(16)}>&#9634; &nbsp;Sport</li>
            <li></li>
          </ul>
        </div>
        <div style={{display: "flex", justifyContent: "center", position: "fixed", top: 0, right: 0, left: 0, height: "50px", background: "hsl(0, 0%, 10%)", outline: "1px solid hsla(0, 0%, 20%, 1.0)", zIndex: 1000, boxShadow: "0 1px 10px hsl(0, 0%, 0%)"}}>
        <div style={{display: "flex", justifyContent: "center", position: "fixed", bottom: -51, right: 0, left: 0, height: "50px", background: "hsl(0, 0%, 10%)", outline: "1px solid hsla(0, 0%, 20%, 1.0)", zIndex: 1000, boxShadow: "0 -1px 10px hsl(0, 0%, 0%)"}} />
          <div style={{position: "absolute", display: "flex", alignItems: "center", left: 0, top: 0, height: 50, padding: "0 20px", cursor: "pointer", zIndex: 1001}} onClick={this.handleShowMenu}>
            <img src="icons/menu-button.svg" height="25" />
          </div>
          <div style={{display: "flex", justifyContent: "center", width: 1280, alignItems: "center", xpadding: "0 10px", xpaddingTop: 4, position: "relative"}}>
            {/*<div style={{width: 0}}>
              <div className="directors">
                <h1 style={{fontSize: 25}}>Directors</h1>
                <ul style={{position: "absolute"}}>
                  {directorsSortedByCount.entrySeq().map(([director, count]) => <li key={director}>{director} ({count})</li>)}
                </ul>
              </div>
            </div>*/}
            <div style={{fontSize: 30, xfontWeight: 700, paddingTop: 4}}>
              <span style={{fontSize: 30, fontWeight: 800}}>Movies</span> ({this.state.movies.size})
            </div>
          </div>
        </div>
        <MovieList movies={this.state.movies} directors={directors} watchlistIds={this.state.watchlistIds} favoriteIds={this.state.favoriteIds} selectedIndex={this.state.selectedIndex}
                   onSelectIndex={this.handleSelectIndex} onToggleWatchlist={this.handleToggleWatchlist} onToggleFavorite={this.handleToggleFavorite} />
      </div>
    );
  }

}

ReactDOM.render(
  <App movies={movies} />,
  document.getElementById("root")
);
