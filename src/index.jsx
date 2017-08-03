import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";

import smoothScroll from "smoothscroll";

import movies from "./movies";
import directors from "./directors";
import categories from "./categories";


class Movie extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      imageURL: null
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  loadImages() {
    if (this.li.offsetTop < window.innerHeight + window.scrollY && !this.state.imageURL) {
      this.setState({
        imageURL: "images/" + (this.props.image ? this.props.image : this.props.title.replace(/ /g, "_") + ".jpg")
      });
    }
  }

  handleScroll(event) {
    this.loadImages();
  }

  handleClick(event) {
    this.props.onSelectIndex(this.props.index);
  }

  componentDidMount() {
    this.loadImages();

    document.addEventListener("scroll", this.handleScroll, false);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.handleScroll, false);
  }

  componentDidUpdate() {
    console.log("componentDidUpdate()");
    this.loadImages();

    if (this.props.selected && ((this.li.offsetTop + this.li.offsetHeight + 10) > (window.innerHeight + document.body.scrollTop) ||
                                (this.li.offsetTop < document.body.scrollTop + 50))) {
      //smoothScroll(this.li.offsetTop - 105 - (window.innerHeight / 2) + (this.li.offsetTop / 2));
      //smoothScroll(this.li.offsetTop - ((window.innerHeight + 50) / 2) + (this.li.offsetHeight / 2));
      smoothScroll(this.li.offsetTop - ((window.innerHeight + 50 - this.li.offsetHeight) / 2) + 16);
    }
  }

  render() {
    console.log("Movie#render()");

    const group = this.props.group ? (
      <h1>{this.props.group}</h1>
    ) : null;

    const stem = this.props.selected ? (
      <div style={{position: "absolute", background: "hsl(0, 0%, 10%)", width: 13, height: 13, left: "50%", marginLeft: -7, bottom: -25,
                   transform: "rotate(45deg)", borderLeft: "1px solid hsl(0, 0%, 20%)", borderTop: "1px solid hsl(0, 0%, 20%)"}}></div>
    ) : null;

    const details = this.props.selected ? (
      <div className="details" style={{height: 70, marginTop: 20, marginBottom: 10}}>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", position: "absolute", left: 0, right: 0, padding: "0 0px",
                     background: "hsl(0, 0%, 10%", height: 70, borderTop: "1px solid hsl(0, 0%, 20%)"}}>
          <div style={{fontSize: 20, fontWeight: 700, display: "flex", justifyContent: "center", marginBottom: 8}}>{this.props.title}</div>
          <div style={{fontSize: 15, fontWeight: 400, display: "flex", justifyContent: "center"}}>
            {this.props.released}
            &nbsp; &#9724;&#xfe0e; &nbsp;
            {this.props.directors ? this.props.directors.map(id => directors.get(id)).join(", ") : "Unknown"}
          </div>
        </div>
      </div>
    ) : null;

    return (
      <li ref={li => this.li = li} className={this.props.selected ? "selected" : ""} data-index={this.props.index}>
        <h1>{this.props.group}</h1>
        <div className="image" data-title={this.props.title} data-released={this.props.released} onClick={this.handleClick}>
          {stem}
          <img src={this.state.imageURL} title={this.props.title} />
          <div className="watched" style={{display: "flex", xjustifyContent: "space-around", alignItems: "flex-end", position: "absolute", bottom: 0, left: 0, right: 0, height: 50}}>
            <img src="/icons/numbered-items.svg" style={{flex: 1, xwidth: 30, height: 30}} />
            <img src="/icons/verification-sign.svg" style={{flex: 1, xwidth: 30, height: 30}} />
            <img src="/icons/heart.svg" style={{flex: 1, xwidth: 30, height: 30}} />
          </div>
        </div>
        {details}
      </li>
    );
  }

}

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

const ascending  = f => (a, b) => f(b, a);
const descending = f => (a, b) => f(a, b);
const always     = x => (a, b) => x;

const byReleased = (order, secondary = always(0)) => order((a, b) => {
  if (a.released > b.released) return -1;
  if (a.released < b.released) return +1;

  return secondary(a, b);
});

const byTitle = (secondary = always(0)) => (a, b) => {
  if (a.title < b.title) return -1;
  if (a.title > b.title) return +1;

  return secondary(a, b);
}

const title = movie => movie.title;

const index = (movie, index) => {
  return { index: index, title: movie.title, image: movie.image, released: movie.released, directors: movie.directors, categories: movie.categories };
};

const range = movie => {
  const scale = movie.released < 1980 ? 10 : 1;

  return Math.floor(movie.released / scale) * scale;
};


class MovieList extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.movies.isEmpty()) {
      return (
        <div style={{marginTop: 50, flex: 1, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 30}}>No Matches</div>
      );
    }

    return (
      <ul className="movies">
        {this.props.movies.reduce(([released, list], movie) => {
          const element = <Movie key={movie.title} index={movie.index} title={movie.title} released={movie.released} directors={movie.directors} categories={movie.categories} image={movie.image}
                                 selected={movie.index === this.props.selectedIndex} group={released !== movie.released ? movie.released : ""} onSelectIndex={this.props.onSelectIndex} />;

          return [movie.released, list.concat(element)];
        }, [0, []])[1]}
      </ul>
    );
  }
}


class App extends React.PureComponent {

  constructor(props) {
    super(props);

    this.buildData();

    this.state = {
      selectedIndex: 0,
      categoryIds: Immutable.Set(),
      sortOrder: descending,
      showMenu: false
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSelectIndex = this.handleSelectIndex.bind(this);
    this.handleSortYearDescending = this.handleSortYearDescending.bind(this);
    this.handleSortYearAscending = this.handleSortYearAscending.bind(this);
    this.handleShowMenu = this.handleShowMenu.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  handleKeyDown(event) {
    console.log(KeyboardEvent);

    const offset = (() => {
      if (event.keyCode === KeyCode.ARROW_RIGHT && this.state.selectedIndex < this.props.movies.size - 1) {
        return this.state.selectedIndex + 1;
      } else if (event.keyCode === KeyCode.ARROW_LEFT && this.state.selectedIndex > 0) {
        return this.state.selectedIndex - 1;
      } else if (event.keyCode === KeyCode.ARROW_DOWN) {
        event.stopPropagation();
        event.preventDefault();

        const selectedItem = document.querySelector(".movies li.selected");
        const allItems = Immutable.List(document.querySelectorAll(".movies li"));
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

  handleSelectIndex(index) {
    this.setState({
      selectedIndex: index
    });
  }

  buildData() {
    this.indexed = this.props.movies.sort(byReleased(descending, byTitle())).map(index);

    this.directors2 = this.props.movies.reduce((map, movie) => {
      return map.update(movie.directors ? directors.get(movie.directors[0]) : "Unknown", (count = 0) => count + 1)
    }, Immutable.Map());

    this.directorsSortedByCount = this.directors2.sortBy((count, director) => -count);
  }

  refreshList() {
    this.forceUpdate();
    this.setState({
      selectedIndex: 0
    });
    smoothScroll(0);
  }

  handleSortYearAscending(event) {
    this.setState(state => ({
      sortOrder: ascending
    }));

    this.indexed = this.props.movies.sort(byReleased(ascending, byTitle())).map(index);
    this.refreshList();
  }

  handleSortYearDescending(event) {
    this.setState(state => ({
      sortOrder: descending
    }));

    this.indexed = this.props.movies.sort(byReleased(descending, byTitle())).map(index);
    this.refreshList();
  }

  handleChangeCategory(categoryId) {
    return event => {
      const categoryIds = this.state.categoryIds.includes(categoryId) ? this.state.categoryIds.delete(categoryId) : this.state.categoryIds.add(categoryId);
      console.log(categoryIds);

      this.setState(state => ({
        categoryIds: categoryIds
      }));

      if (categoryIds.isEmpty()) {
        this.indexed = this.props.movies.sort(byReleased(descending, byTitle())).map(index);
      } else {
        //this.indexed = this.props.movies.filter(movie => !Immutable.Set(movie.categories).intersect(categoryIds).isEmpty()).sort(byReleased(descending, byTitle())).map(index);
        this.indexed = this.props.movies.filter(movie => Immutable.Set(movie.categories).isSuperset(categoryIds)).sort(byReleased(descending, byTitle())).map(index);
      }

      this.refreshList();
    };
  }

  handleShowMenu(event) {
    this.setState(state => ({
      showMenu: !state.showMenu
    }));
  }

  handleMouseDown(event) {
    this.setState(state => ({
      showMenu: false
    }));
  }

  render() {
    console.log("App#render()");

    const selectedMovie = this.indexed.find(movie => movie.index === this.state.selectedIndex);

    return (
      <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}} xonMouseDown={this.handleMouseDown}>
        <div className={"menu" + (this.state.showMenu ? " open" : "")} style={{display: "flex", flexDirection: "column", position: "fixed", bottom: 0, left: 0, top: 0, xwidth: "156px", padding: "73px 20px 0 20px", background: "hsla(0, 0%, 0%, 0.9)", zIndex: 1000}}>
          <div style={{position: "fixed", top: 0, zIndex: 1000001}}>Genres</div>

          <h1>Sort By</h1>
          <ul style={{columnCount: 2, columnGap: 20}}>
            <li className={this.state.sortOrder === descending ? "selected" : ""} style={{breakBefore: "column"}} onClick={this.handleSortYearDescending}>&#9634; &nbsp;Year &nbsp;&#8595;</li>
            <li className={this.state.sortOrder === ascending ? "selected" : ""} style={{breakBefore: "column"}} onClick={this.handleSortYearAscending}>&#9634; &nbsp;Year &nbsp;&#8593;</li>
          </ul>
          <h1>Show</h1>
          <ul style={{columnCount: 2, columnGap: 20}}>
            <li className={this.state.categoryIds.includes(0) ? "selected" : ""} style={{breakBefore: "column"}} onClick={this.handleChangeCategory(0)}>&#9634; &nbsp;Wishlist</li>
            <li className={this.state.categoryIds.includes(0) ? "selected" : ""} style={{breakBefore: "column"}} onClick={this.handleChangeCategory(0)}>&#9634; &nbsp;Unseen</li>
          </ul>
          <h1>Genres</h1>
          <ul style={{columnCount: 2, columnGap: 20}}>
            <li className={this.state.categoryIds.includes(0) ? "selected" : ""} onClick={this.handleChangeCategory(0)}>&#9634; &nbsp;Sci-Fi</li>
            <li className={this.state.categoryIds.includes(1) ? "selected" : ""} onClick={this.handleChangeCategory(1)}>&#9634; &nbsp;Drama</li>
            <li className={this.state.categoryIds.includes(2) ? "selected" : ""} onClick={this.handleChangeCategory(2)}>&#9634; &nbsp;Comedy</li>
            <li className={this.state.categoryIds.includes(3) ? "selected" : ""} onClick={this.handleChangeCategory(3)}>&#9634; &nbsp;Crime</li>
            <li className={this.state.categoryIds.includes(4) ? "selected" : ""} onClick={this.handleChangeCategory(4)}>&#9634; &nbsp;Action</li>
            <li className={this.state.categoryIds.includes(5) ? "selected" : ""} onClick={this.handleChangeCategory(5)}>&#9634; &nbsp;Thriller</li>
            <li className={this.state.categoryIds.includes(6) ? "selected" : ""} onClick={this.handleChangeCategory(6)}>&#9634; &nbsp;Adventure</li>
            <li className={this.state.categoryIds.includes(7) ? "selected" : ""} onClick={this.handleChangeCategory(7)}>&#9634; &nbsp;Western</li>
            <li className={this.state.categoryIds.includes(8) ? "selected" : ""} onClick={this.handleChangeCategory(8)}>&#9634; &nbsp;Horror</li>
            <li className={this.state.categoryIds.includes(9) ? "selected" : ""} onClick={this.handleChangeCategory(9)}>&#9634; &nbsp;Music</li>
            <li className={this.state.categoryIds.includes(10) ? "selected" : ""} onClick={this.handleChangeCategory(10)}>&#9634; &nbsp;Fantasy</li>
            <li className={this.state.categoryIds.includes(11) ? "selected" : ""} onClick={this.handleChangeCategory(11)}>&#9634; &nbsp;Animation</li>
            <li className={this.state.categoryIds.includes(12) ? "selected" : ""} onClick={this.handleChangeCategory(12)}>&#9634; &nbsp;Romance</li>
            <li className={this.state.categoryIds.includes(13) ? "selected" : ""} onClick={this.handleChangeCategory(13)}>&#9634; &nbsp;Biography</li>
            <li className={this.state.categoryIds.includes(14) ? "selected" : ""} onClick={this.handleChangeCategory(14)}>&#9634; &nbsp;Mystery</li>
            <li className={this.state.categoryIds.includes(15) ? "selected" : ""} onClick={this.handleChangeCategory(15)}>&#9634; &nbsp;Family</li>
            <li className={this.state.categoryIds.includes(16) ? "selected" : ""} onClick={this.handleChangeCategory(16)}>&#9634; &nbsp;Sport</li>
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
              <span style={{fontSize: 30, fontWeight: 800}}>Movies</span> ({this.indexed.size})
            </div>
          </div>
        </div>
        <MovieList movies={this.indexed} selectedIndex={this.state.selectedIndex} onSelectIndex={this.handleSelectIndex} />
      </div>
    );
  }

}

ReactDOM.render(
  <App movies={movies} />,
  document.getElementById("root")
);

//          {this.props.movies.map(movie => <Movie key={movie.title} title={movie.title} image={movie.image} />)}
