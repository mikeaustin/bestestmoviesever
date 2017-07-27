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
    return (
      <li ref={li => this.li = li} className={this.props.selected ? "selected" : ""} data-title={this.props.title} data-released={this.props.released}>
        <img src={this.state.imageURL} title={this.props.title} />
      </li>
    );
  }

}

class App extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: -1
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", event => {
      if (event.code === "ArrowRight" && this.state.selectedIndex < this.props.movies.size - 1) {
        this.setState(state => ({
          selectedIndex: state.selectedIndex + 1
        }));
      } else if (event.code === "ArrowLeft" && this.state.selectedIndex > 0) {
        this.setState(state => ({
          selectedIndex: state.selectedIndex - 1
        }));
      }
    }, false);
  }

  render() {
    const released = movie => movie.released;

    const index = (movie, index) => {
      return {index: index, title: movie.title, image: movie.image, released: movie.released};
    };

    const range = movie => {
      const scale = movie.released < 1980 ? 10 : 1;

      return Math.floor(movie.released / scale) * scale;
    };

    const sorted = this.props.movies.sortBy(released).map(index).groupBy(range).entrySeq();

    const directors2 = this.props.movies.reduce((map, movie) => {
      return map.update(movie.directors ? directors.get(movie.directors[0]) : "Unknown", (count = 0) => count + 1)
    }, Immutable.Map());

    const directorsSortedByCount = directors2.sortBy((count, director) => -count);

    //console.log(directorsSortedByCount);

    return (
      <div>
        <div style={{display: "flex", justifyContent: "center", position: "fixed", top: 0, right: 0, left: 0, height: "50px", background: "hsl(0, 0%, 10%)", outline: "1px solid hsla(0, 0%, 0%, 1.0)", zIndex: 1000}}>
          <div style={{display: "flex", justifyContent: "space-between", width: 1280, alignItems: "center", xpadding: "0 10px", xpaddingTop: 4, position: "relative"}}>
            <div style={{width: 300}}>
              {/*<div className="directors">
                <h1 style={{fontSize: 25}}>Directors</h1>
                <ul style={{position: "absolute"}}>
                  {directorsSortedByCount.entrySeq().map(([director, count]) => <li key={director}>{director} ({count})</li>)}
                </ul>
              </div>*/}
            </div>
            <div style={{fontSize: 25, paddingTop: 2}}>{this.props.movies.size} Movies</div>
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
        <ul className="groups">
          {sorted.map(([decade, movies], decadeIndex) => {
            return (
              <li key={decade}>
                <h1>{decade}</h1>
                <ul className="movies">
                  {movies.map((movie, movieIndex) => <Movie key={movie.title} index={movie.index} title={movie.title} released={movie.released} image={movie.image} selected={movie.index === this.state.selectedIndex} />)}
                </ul>
              </li>
            );
          })}

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
