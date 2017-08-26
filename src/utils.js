import Immutable from "immutable";


export const KeyCode = {
  TAB:          9,
  ENTER:       13,
  ESCAPE:      27,
  SPACE:       32,
  ARROW_LEFT:  37,
  ARROW_UP:    38,
  ARROW_RIGHT: 39,
  ARROW_DOWN:  40,
  NUMBER_1:    49,
  NUMBER_2:    50,
  NUMBER_3:    51
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


// const always     = x => (a, b) => x;
// const comparator = f => (next = always(0), x, y) => (a, b) => f(a, b) ? -1 : f(b, a) ? 1 : next(x, y);
// const ascending  = (next, x, y) => comparator((a, b) => a < b)(next, x, y);
// const descending = (next, x, y) => comparator((a, b) => a > b)(next, x, y);
// const byReleased = order => next => (a, b) => order(next, a, b)(a.released, b.released);
// const byTitle    = next => (a, b) => ascending(next)(a.title, b.title);
// const withIndex  = (movie, index) => {
//   return { index: index, id: movie.id, title: movie.title, image: movie.image, released: movie.released, directors: movie.directors, categories: movie.categories };
// };


export const FilterActions = (() => {

  const sortYearAscending = state => {
    return {
      selectedIndex: 0,
      sortOrder: SortOrder.ASCENDING
    };
  };

  const sortYearDescending = state => {
    return {
      selectedIndex: 0,
      sortOrder: SortOrder.DESCENDING
    };
  };

  const showWatchlist = state => {
    const showWatchlist = !state.showWatchlist;

    return {
      selectedIndex: 0,
      showWatchlist: showWatchlist,
      showFavorites: false,
      showUnwatched: false
    };
  };

  const showFavorites = state => {
    const showFavorites = !state.showFavorites;

    return {
      selectedIndex: 0,
      showFavorites: showFavorites,
      showWatchlist: false,
      showUnwatched: false
    };
  };

  const showUnwatched = state => {
    const showUnwatched = !state.showUnwatched;

    return {
      selectedIndex: 0,
      showUnwatched: showUnwatched,
      showWatchlist: false,
      showFavorites: false
    };
  };

  const changeCategory = categoryId => {
    return state => {
      const categoryIds = state.categoryIds.includes(categoryId) ? state.categoryIds.delete(categoryId) : state.categoryIds.add(categoryId);

      return {
        selectedIndex: 0,
        categoryIds: categoryIds
      };
    };
  };

  return {
    sortYearAscending,
    sortYearDescending,
    showWatchlist,
    showFavorites,
    showUnwatched,
    changeCategory
  };

})();

export const ToggleActions = (() => {

  const toggleWatchlist = movieId => state => {
    const watchlistIds = state.watchlistIds.includes(movieId) ? state.watchlistIds.remove(movieId) : state.watchlistIds.add(movieId);

    localStorage.setItem("watchlistIds", JSON.stringify(watchlistIds.toArray()));

    return {
      watchlistIds: watchlistIds,
    };
  };

  const toggleFavorite = movieId => state => {
    const favoriteIds = state.favoriteIds.includes(movieId) ? state.favoriteIds.remove(movieId) : state.favoriteIds.add(movieId);

    localStorage.setItem("favoriteIds", JSON.stringify(favoriteIds.toArray()));

    return {
      favoriteIds: favoriteIds,
    };
  };

  const toggleWatched = movieId => state => {
    const watchedIds = state.watchedIds.includes(movieId) ? state.watchedIds.remove(movieId) : state.watchedIds.add(movieId);

    localStorage.setItem("watchedIds", JSON.stringify(watchedIds.toArray()));

    return {
      watchedIds: watchedIds,
    };
  };

  return {
    toggleWatchlist,
    toggleFavorite,
    toggleWatched
  };

})();

export const NavigationActions = (() => {

  const moveLeft = state => {
    if (state.selectedIndex > 0) {
      return {
        selectedIndex: state.selectedIndex - 1
      };
    }
  };

  const moveRight = state => {
    if (state.selectedIndex < state.movies.size - 1) {
      return {
        selectedIndex: state.selectedIndex + 1
      };
    }
  };

  const moveUp = (allItems, selectedItem, maxOffsetLeft) => state => {
    const nextRowItems = new ListReducer(allItems.toSeq().reverse())
      .skipWhile(item => Number(item.dataset.index) !== state.selectedIndex)
      .skip(1).skipWhile(item => item.offsetLeft < selectedItem.offsetLeft)
      .take(1).takeWhile(item => item.offsetLeft >= selectedItem.offsetLeft && item.offsetLeft !== maxOffsetLeft);

    if (!nextRowItems.isEmpty()) {
      return {
        selectedIndex: Number(nextRowItems.last().dataset.index)
      };
    } else {
      return state;
    }
  };

  const moveDown = (allItems, selectedItem, minOffsetLeft) => state => {
    const nextRowItems = new ListReducer(allItems.toSeq())
      .skipWhile(item => Number(item.dataset.index) !== state.selectedIndex)
      .take(1).skipWhile(item => item.offsetLeft > selectedItem.offsetLeft)
      .take(1).takeWhile(item => item.offsetLeft <= selectedItem.offsetLeft && item.offsetLeft !== minOffsetLeft);

    if (!nextRowItems.isEmpty()) {
      return {
        selectedIndex: Number(nextRowItems.last().dataset.index)
      };
    } else {
      return state;
    }
  };

  return {
    moveLeft,
    moveRight,
    moveUp,
    moveDown
  }

})();
