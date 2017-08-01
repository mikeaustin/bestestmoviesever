import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";

import smoothScroll from "smoothscroll";

import directors from "./directors";
import movies from "./movies";


const categories = {
  1: "SciFi",
  2: "Action",
  3: "Comedy",
  4: "Horror",
  5: "Drama",
  6: "Thriller"
}

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
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", position: "absolute", left: 20, right: 20, padding: "0 0px", background: "hsl(0, 0%, 10%", height: 70,
                     border: "1px solid hsl(0, 0%, 20%)"}}>
          <div style={{fontSize: 20, fontWeight: 700, display: "flex", justifyContent: "center", marginBottom: 8}}>{this.props.title}</div>
          <div style={{fontSize: 15, fontWeight: 400, display: "flex", justifyContent: "center"}}>{this.props.released} &nbsp;&#9642;&nbsp; {this.props.directors ? this.props.directors.map(id => directors.get(id)).join(", ") : "Unknown"}</div>
        </div>
      </div>
    ) : null;

    return (
      <li ref={li => this.li = li} className={this.props.selected ? "selected" : ""} data-index={this.props.index} data-title={this.props.title} data-released={this.props.released}>
        <h1>{this.props.group}</h1>
        <div className="image" data-title={this.props.title} data-released={this.props.released} onClick={this.handleClick}>
          {stem}
          <img src={this.state.imageURL} title={this.props.title} />
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
  return {index: index, title: movie.title, image: movie.image, released: movie.released, directors: movie.directors};
};

const range = movie => {
  const scale = movie.released < 1980 ? 10 : 1;

  return Math.floor(movie.released / scale) * scale;
};


class MovieList extends React.PureComponent {
  
}


class App extends React.PureComponent {

  constructor(props) {
    super(props);

    this.buildData();

    this.state = {
      selectedIndex: 0,
      categoryIds: []
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSelectIndex = this.handleSelectIndex.bind(this);
    this.handleSortYearDescending = this.handleSortYearDescending.bind(this);
    this.handleSortYearAscending = this.handleSortYearAscending.bind(this);
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

        // const afterSelectedItems = allItems.toSeq()
        //                      .skipWhile(item => Number(item.dataset.index) <= this.state.selectedIndex)
        //                      .skipWhile(item => item.offsetLeft > selectedItem.offsetLeft)

        // const nextRowItems = afterSelectedItems.take(1).concat(afterSelectedItems.skip(1).takeWhile(
        //   item => item.offsetLeft <= selectedItem.offsetLeft && item.offsetLeft !== allItems.first().offsetLeft
        // ));

        //return Number(nextRowItems.last().dataset.index);

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
    smoothScroll(1);
    smoothScroll(0);

    window.scrollTo(0, -1);
    // const event = new Event("UIEvents");
    // event.initUIEvent("scroll", true, true, window, 1);
    // document.dispatchEvent(event);
  }

  handleSortYearAscending(event) {
    this.indexed = this.props.movies.sort(byReleased(ascending, byTitle())).map(index);
    this.refreshList();
  }

  handleSortYearDescending(event) {
    this.indexed = this.props.movies.sort(byReleased(descending, byTitle())).map(index);
    this.refreshList();
  }

  handleChangeCategory(categoryId) {
    return event => {
      this.indexed = this.props.movies.filter(movie => (movie.categories || []).includes(categoryId)).sort(byReleased(descending, byTitle())).map(index);
      this.refreshList();
    };
  }

  render() {
    console.log("App#render()");

    const selectedMovie = this.indexed.find(movie => movie.index === this.state.selectedIndex);

    return (
      <div>
        <div className="categories" style={{display: "flex", flexDirection: "column", position: "fixed", bottom: 0, left: 0, top: 0, xwidth: "156px", padding: "70px 15px 0 15px", background: "hsla(0, 0%, 0%, 0.9)", zIndex: 1000, boxShadow: "0 -1px 10px hsl(0, 0%, 0%)"}}>
          <div style={{position: "fixed", top: 0, zIndex: 1000001}}>Genres</div>
          <h1 style={{fontWeight: 800}}>Sort By</h1>
          <div onClick={this.handleSortYearDescending}>&#9634; &nbsp;Year &nbsp;&#8595;</div>
          <div onClick={this.handleSortYearAscending}>&#9634; &nbsp;Year &nbsp;&#8593;</div>
          <h1 style={{fontWeight: 800}}>Genres</h1>
          <div className="selected" onClick={this.handleChangeCategory(0)}>&#9634; &nbsp;Sci-Fi</div>
          <div onClick={this.handleChangeCategory(1)}>&#9634; &nbsp;Drama</div>
          <div>&#9634; &nbsp;Comedy</div>
          <div>&#9634; &nbsp;Crime</div>
          <div>&#9634; &nbsp;Action</div>
          <div>&#9634; &nbsp;Thriller</div>
          <div>&#9634; &nbsp;Adventure</div>
          <div>&#9634; &nbsp;Western</div>
          <div>&#9634; &nbsp;Horror</div>
          <div>&#9634; &nbsp;Music</div>
        </div>
        <div style={{display: "flex", justifyContent: "center", position: "fixed", bottom: -51, right: 0, left: 0, height: "50px", background: "hsl(0, 0%, 10%)", outline: "1px solid hsla(0, 0%, 20%, 1.0)", zIndex: 1000, boxShadow: "0 -1px 10px hsl(0, 0%, 0%)"}} />
        <div style={{display: "flex", justifyContent: "center", position: "fixed", top: 0, right: 0, left: 0, height: "50px", background: "hsl(0, 0%, 10%)", outline: "1px solid hsla(0, 0%, 20%, 1.0)", zIndex: 1000, boxShadow: "0 1px 10px hsl(0, 0%, 0%)"}}>
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
          <ul className="movies">
            {this.indexed.reduce(([released, list], movie) => {
              const element = <Movie key={movie.title} index={movie.index} title={movie.title} released={movie.released} directors={movie.directors} image={movie.image}
                                     selected={movie.index === this.state.selectedIndex} group={released !== movie.released ? movie.released : ""} onSelectIndex={this.handleSelectIndex} />;

              return [movie.released, list.concat(element)];
            }, [0, []])[1]}
          </ul>
      </div>
    );
  }

}

ReactDOM.render(
  <App movies={movies} />,
  document.getElementById("root")
);

//          {this.props.movies.map(movie => <Movie key={movie.title} title={movie.title} image={movie.image} />)}
