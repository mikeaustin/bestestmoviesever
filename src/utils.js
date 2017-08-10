import Immutable from "immutable";


export const KeyCode = {
  ARROW_LEFT:  37,
  ARROW_UP:    38,
  ARROW_RIGHT: 39,
  ARROW_DOWN:  40,
  SPACE:       32
};

export const SortOrder = {
  ASCENDING:  -1,
  DESCENDING: +1
};


export const selectedClass = f => x => f(x) ? " selected" : "";
export const combineEvery = fs => x => fs.every(f => f(x));

export class ListReducer {

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


const always     = x => (a, b) => x;
const comparator = f => (next = always(0), x, y) => (a, b) => f(a, b) ? -1 : f(b, a) ? 1 : next(x, y);
const ascending  = (next, x, y) => comparator((a, b) => a < b)(next, x, y);
const descending = (next, x, y) => comparator((a, b) => a > b)(next, x, y);
const byReleased = order => next => (a, b) => order(next, a, b)(a.released, b.released);
const byTitle    = next => (a, b) => ascending(next)(a.title, b.title);
const withIndex  = (movie, index) => {
  return { index: index, id: movie.id, title: movie.title, image: movie.image, released: movie.released, directors: movie.directors, categories: movie.categories };
};


export const FilterEventHelper = {

  handleSortYearAscending(app, event) {
    app.setState(state => ({
      sortOrder: SortOrder.ASCENDING
    }), () => app.refreshList());
  },

  handleSortYearDescending(app, event) {
    app.setState(state => ({
      sortOrder: SortOrder.DESCENDING
    }), () => app.refreshList());
  },

  handleShowFavorites: (app, event) => {
    app.setState(state => {
      const showFavorites = !state.showFavorites;

      return {
        showFavorites: showFavorites,
        showWatchlist: false
      };
    }, () => app.refreshList());
  },

  handleShowWatchlist: (app, event) => {
    app.setState(state => {
      const showWatchlist = !state.showWatchlist;

      return {
        showWatchlist: showWatchlist,
        showFavorites: false
      };
    }, () => app.refreshList());
  },

  handleChangeCategory(app, categoryId) {
    return event => {
      const categoryIds = app.state.categoryIds.includes(categoryId) ? app.state.categoryIds.delete(categoryId) : app.state.categoryIds.add(categoryId);

      app.setState(state => ({
        categoryIds: categoryIds,
      }), () => app.refreshList());
    };
  }

}
