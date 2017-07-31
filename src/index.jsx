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
    if (this.props.selected && ((this.li.offsetTop + this.li.offsetHeight + 10) > (window.innerHeight + document.body.scrollTop) ||
                                (this.li.offsetTop < document.body.scrollTop + 50))) {
      //smoothScroll(this.li.offsetTop - 105 - (window.innerHeight / 2) + (this.li.offsetTop / 2));
      //smoothScroll(this.li.offsetTop - ((window.innerHeight + 50) / 2) + (this.li.offsetHeight / 2));
      smoothScroll(this.li.offsetTop - ((window.innerHeight + 50 - this.li.offsetHeight) / 2));
    }
  }

  render() {
    const group = this.props.group ? (
      <h1>{this.props.group}</h1>
    ) : null;

    const stem = this.props.selected ? (
      <div style={{position: "absolute", background: "hsl(0, 0%, 10%)", width: 13, height: 13, left: "50%", marginLeft: -7, bottom: -25,
                   transform: "rotate(45deg)", borderLeft: "1px solid hsl(0, 0%, 20%)", borderTop: "1px solid hsl(0, 0%, 20%)"}}></div>
    ) : null;

    const details = this.props.selected ? (
      <div className="details" style={{height: 60, marginTop: 20, marginBottom: 10}}>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", position: "absolute", left: 20, right: 20, padding: "0 0px", background: "hsl(0, 0%, 10%", height: 60,
                     border: "1px solid hsl(0, 0%, 20%)"}}>
          <div style={{fontSize: 20, fontWeight: 700, display: "flex", justifyContent: "center", marginBottom: 7}}>{this.props.title}</div>
          <div style={{fontSize: 15, fontWeight: 400, display: "flex", justifyContent: "center"}}>{this.props.released} &nbsp;&#9632;&nbsp; {this.props.directors ? this.props.directors.map(id => directors.get(id)).join(", ") : "Unknown"}</div>
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

class App extends React.PureComponent {

  constructor(props) {
    super(props);

    this.buildData();

    this.state = {
      selectedIndex: 0
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSelectIndex = this.handleSelectIndex.bind(this);
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

          return Number(nextRowItems.last().dataset.index);
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
    //const released = movie => -movie.released;

    const byReleasedAndTitle = (a, b) => {
      if (a.released > b.released) return -1;
      if (a.released < b.released) return 1;
      if (a.released === b.released) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      }
    }

    const title = movie => movie.title;

    const index = (movie, index) => {
      return {index: index, title: movie.title, image: movie.image, released: movie.released, directors: movie.directors};
    };

    const range = movie => {
      const scale = movie.released < 1980 ? 10 : 1;

      return Math.floor(movie.released / scale) * scale;
    };

    //this.indexed = this.props.movies.sortBy(released).map(index);
    this.indexed = this.props.movies.sort(byReleasedAndTitle).map(index);
    this.sorted = this.indexed.groupBy(range).entrySeq();

    this.directors2 = this.props.movies.reduce((map, movie) => {
      return map.update(movie.directors ? directors.get(movie.directors[0]) : "Unknown", (count = 0) => count + 1)
    }, Immutable.Map());

    this.directorsSortedByCount = this.directors2.sortBy((count, director) => -count);
  }

  render() {
    const selectedMovie = this.indexed.find(movie => movie.index === this.state.selectedIndex);

    return (
      <div>
        <div style={{display: "flex", justifyContent: "center", position: "fixed", top: 0, right: 0, left: 0, height: "45px", background: "hsl(0, 0%, 10%)", outline: "1px solid hsla(0, 0%, 100%, 0.2)", zIndex: 1000}}>
          <div style={{display: "flex", justifyContent: "space-between", width: 1280, alignItems: "center", xpadding: "0 10px", xpaddingTop: 4, position: "relative"}}>
            <div style={{width: 300}}>
              {/*<div className="directors">
                <h1 style={{fontSize: 25}}>Directors</h1>
                <ul style={{position: "absolute"}}>
                  {directorsSortedByCount.entrySeq().map(([director, count]) => <li key={director}>{director} ({count})</li>)}
                </ul>
              </div>*/}
            </div>
            <div style={{fontSize: 30, xfontWeight: 700, paddingTop: 4}}>
              <span style={{fontSize: 30, fontWeight: 800}}>Movies</span> ({this.indexed.size})
            </div>
            <div style={{fontSize: 25, width: 300, padding: "0 20px", display: "flex", justifyContent: "flex-end"}}>
              {/*<div style={{position: "absolute", display: "flex", flexDirection: "column"}}>
                <table id="categories">
                  <thead>
                    <tr><th>AND</th><th></th><th>OR</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><input type="checkbox" /></td><td>Sci-Fi</td><td><input type="checkbox" /></td></tr>
                    <tr><td><input type="checkbox" /></td><td>Drama</td><td><input type="checkbox" /></td></tr>
                    <tr><td><input type="checkbox" /></td><td>Comedy</td><td><input type="checkbox" /></td></tr>
                  </tbody>
                </table>
              </div>*/}

              <select style={{color: "black", display: "none"}}>
                <option value="0">Sci-Fi</option>
                <option value="1">Drama</option>
                <option value="2">Comedy</option>
                <option value="3">Crime</option>
                <option value="4">Action</option>
                <option value="5">Thriller</option>
                <option value="6">Adventure</option>
                <option value="7">Western</option>
                <option value="8">Horror</option>
              </select>
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
