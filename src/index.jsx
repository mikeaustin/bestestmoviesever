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
  ARROW_LEFT:  37,
  ARROW_UP:    38,
  ARROW_RIGHT: 39,
  ARROW_DOWN:  40,
  SPACE:       32
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

    this.selectedItem = document.querySelector(".movies > li.selected");
    this.allItems = Immutable.List(document.querySelectorAll(".movies > li"));
    this.firstItem = this.allItems.first();
  }

  componentDidUpdate() {
    this.selectedItem = document.querySelector(".movies > li.selected");
    this.allItems = Immutable.List(document.querySelectorAll(".movies > li"));
    //this.firstItem = this.allItems.first();
    this.minOffsetLeft = this.allItems.first().offsetLeft;
    this.maxOffsetLeft = this.allItems.reduce((max, item) => Math.max(item.offsetLeft, max), 0);
  }

  handleKeyDown = (event) => {
    console.log(event.keyCode);

    const offset = (() => {
      if (event.keyCode === KeyCode.ARROW_RIGHT && this.state.selectedIndex < this.props.movies.size - 1) {
        return this.state.selectedIndex + 1;
      } else if (event.keyCode === KeyCode.ARROW_LEFT && this.state.selectedIndex > 0) {
        return this.state.selectedIndex - 1;
      } else if (event.keyCode === KeyCode.SPACE) {
        event.stopPropagation();
        event.preventDefault();

        const selectedMovie = this.state.movies.find(movie => movie.index === this.state.selectedIndex);

        this.handleToggleFavorite(selectedMovie.id);
      } else if (event.keyCode === KeyCode.ARROW_DOWN) {
        event.stopPropagation();
        event.preventDefault();

        const nextRowItems = new ListReducer(this.allItems.toSeq())
          .skipWhile(item => Number(item.dataset.index) !== this.state.selectedIndex)
          .take(1).skipWhile(item => item.offsetLeft > this.selectedItem.offsetLeft)
          .take(1).takeWhile(item => item.offsetLeft <= this.selectedItem.offsetLeft && item.offsetLeft !== this.minOffsetLeft);

        if (!nextRowItems.isEmpty()) {
          return Number(nextRowItems.last().dataset.index);
        }
      } else if (event.keyCode === KeyCode.ARROW_UP) {
        event.stopPropagation();
        event.preventDefault();

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

  buildData() {
    this.directors2 = this.props.movies.reduce((map, movie) => {
      return map.update(movie.directors ? directors.get(movie.directors[0]) : "Unknown", (count = 0) => count + 1)
    }, Immutable.Map());

    this.directorsSortedByCount = this.directors2.sortBy((count, director) => -count);
  }

  refreshList() {
    console.log("refreshList()");

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
    event.preventDefault();
    event.stopPropagation();

    this.setState(state => ({
      sortOrder: ascending
    }), () => this.refreshList());
  }

  handleSortYearDescending = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState(state => ({
      sortOrder: descending
    }), () => this.refreshList());
  }

  handleChangeCategory(categoryId) {
    return event => {
      event.preventDefault();
      event.stopPropagation();

      const categoryIds = this.state.categoryIds.includes(categoryId) ? this.state.categoryIds.delete(categoryId) : this.state.categoryIds.add(categoryId);

      this.setState(state => ({
        categoryIds: categoryIds,
      }), () => this.refreshList());
    };
  }

  handleShowMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState(state => ({
      showMenu: !state.showMenu
    }));
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
    event.preventDefault();
    event.stopPropagation();

    this.setState(state => {
      const showFavorites = !state.showFavorites;

      return {
        showFavorites: showFavorites,
      };
    }, () => this.refreshList());
  }

  handleShowWatchlist = () => {
    event.preventDefault();
    event.stopPropagation();

    this.setState(state => {
      const showWatchlist = !state.showWatchlist;

      return {
        showWatchlist: showWatchlist,
      };
    }, () => this.refreshList());
  }

  handleTouchStart = event => {
    this.firstX = this.lastX = event.touches[0].clientX;
  }

  handleTouchMove = event => {
    event.preventDefault();
    event.stopPropagation();

    console.log(event.nativeEvent);

    this.lastX = event.touches[0].clientX;
  }

  handleTouchEnd = event => {
    console.log(event.nativeEvent);

    if (this.lastX < this.firstX - 50) {
      this.setState({
        showMenu: false
      });
    }
  }

  render() {
    //console.log("App#render()");

    const selectedMovie = this.state.movies.find(movie => movie.index === this.state.selectedIndex);

    const selectedCategory = selectedClass(arg => this.state.categoryIds.includes(arg));

    const evenCategories = categories.sortBy((genre, id) => id).filter((genre, id) => id % 2 == 0).entrySeq();
    const oddCategories = categories.sortBy((genre, id) => id).filter((genre, id) => id % 2 != 0).set(-1, null).entrySeq();

    return (
      <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
        <div className={"menu" + (this.state.showMenu ? " open" : "")} style={{display: "flex", flexDirection: "column", position: "fixed", bottom: 0, left: 0, top: 0, padding: "72px 20px 0 20px", background: "hsla(0, 0%, 0%, 0.9)", zIndex: 1000}}
             onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}>
          <table>
            <tbody>
              <tr>
                <th>Sort By</th>
              </tr>
              <tr>
                <td className={this.state.sortOrder === descending ? "selected" : ""} onMouseDown={this.handleSortYearDescending}>&#9634; &nbsp;Year &nbsp;&#8595;</td>
                <th style={{width: "20px"}}></th>
                <td className={this.state.sortOrder === ascending ? "selected" : ""} onMouseDown={this.handleSortYearAscending}>&#9634; &nbsp;Year &nbsp;&#8593;</td>
              </tr>
              <tr>
                <th>Show</th>
              </tr>
              <tr>
                <td className={this.state.showWatchlist ? "selected" : ""} onMouseDown={this.handleShowWatchlist}>&#9634; &nbsp;Watchlist</td>
                <th style={{width: "20px"}}></th>
                <td className={this.state.showFavorites ? "selected" : ""} onMouseDown={this.handleShowFavorites}>&#9634; &nbsp;Favorites</td>
              </tr>
              <tr>
                <th>Genres</th>
              </tr>
              {evenCategories.zipWith((a, b) => (
                <tr key={a}>
                  <td className={selectedCategory(a[0])} onMouseDown={this.handleChangeCategory(a[0])}>&#9634; &nbsp;{a[1]}</td>
                  <th style={{width: "20px"}}></th>
                  {b[1] !== null ? <td className={selectedCategory(b[0])} onMouseDown={this.handleChangeCategory(b[0])}>&#9634; &nbsp;{b[1]}</td> : null}
                </tr>
              ), oddCategories)}
            </tbody>
          </table>
        </div>
        <header style={{display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: 0, right: 0, left: 0, height: 50, background: "hsl(0, 0%, 10%)", outline: "1px solid hsla(0, 0%, 20%, 1.0)", zIndex: 1000, boxShadow: "0 1px 10px hsl(0, 0%, 0%)"}}>
          <div style={{position: "absolute", display: "flex", alignItems: "center", left: 0, top: 0, height: 50, padding: "0 20px", cursor: "pointer", zIndex: 1001}} onMouseDown={this.handleShowMenu}>
            <img src="icons/menu-button.svg" height="25" />
          </div>
          <div style={{paddingTop: 4}}>
            <span className="title" style={{fontSize: 30, fontWeight: 800}}>Movies</span> <span className="count" style={{fontSize: 30}}>({this.state.movies.size})</span>
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
  <App movies={movies} />,
  document.getElementById("root")
);
