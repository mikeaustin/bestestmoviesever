import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";

import smoothScroll from "smoothscroll";

import { selectedClass } from "./utils";


class ActionButton extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.props.onInvoke) {
      this.props.onInvoke(this.props.id);
    }
  }

  render() {
    return (
      <li className={this.props.className} onMouseDown={this.handleMouseDown} />
    );
  }  
}


class Movie extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      imageURL: null
    };
  }

  loadImages() {
    if (this.li.offsetTop < window.innerHeight + window.scrollY && !this.state.imageURL) {
      const imageName = this.props.image ? this.props.image : this.props.title.replace(/ /g, "_");
      const baseURL = location.origin === "http://bestestmoviesever.com" ? "http://d1rus1jxo7361x.cloudfront.net" : "";

      this.setState({
        imageURL: baseURL + "/images/" + imageName + ".jpg"
      });
    }
  }

  handleScroll = (event) => {
    this.loadImages();
  }

  handleClick = (event) => {
    this.props.onSelectIndex(this.props.index);
  }

  handleToggleWatchlist = (movieId) => {
    console.log(movieId);

    this.props.onToggleWatchlist(movieId);
  }

  handleToggleFavorite = (movieId) => {
    console.log(movieId);

    this.props.onToggleFavorite(movieId);
  }

  componentDidMount() {
    this.loadImages();

    document.addEventListener("scroll", this.handleScroll, false);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.handleScroll, false);
  }

  componentDidUpdate() {
    //console.log("componentDidUpdate()");
    this.loadImages();

    if (this.props.selected && ((this.li.offsetTop + this.li.offsetHeight + 10) > (window.innerHeight + document.body.scrollTop) ||
                                (this.li.offsetTop < document.body.scrollTop + 50))) {
      //smoothScroll(this.li.offsetTop - 105 - (window.innerHeight / 2) + (this.li.offsetTop / 2));
      //smoothScroll(this.li.offsetTop - ((window.innerHeight + 50) / 2) + (this.li.offsetHeight / 2));
      smoothScroll(this.li.offsetTop - ((window.innerHeight + 50 - this.li.offsetHeight) / 2) + 16);
    }
  }

  render() {
    //console.log("Movie#render()");

    const group = this.props.group ? (
      <h1>{this.props.group}</h1>
    ) : null;

    const stem = this.props.selected ? (
      <div style={{position: "absolute", background: "hsl(0, 0%, 10%)", width: 13, height: 13, left: "50%", marginLeft: -7, bottom: -25,
                   transform: "rotate(45deg)", borderLeft: "1px solid hsl(0, 0%, 20%)", borderTop: "1px solid hsl(0, 0%, 20%)"}}></div>
    ) : null;

    const details = this.props.selected ? (
      <div className="details">
        <div className="bubble">
          <div className="title" style={{fontSize: 20, fontWeight: 700, marginBottom: 8, textAlign: "center"}}>{this.props.title}</div>
          <div className="extra" style={{fontSize: 15, fontWeight: 400, textAlign: "center"}}>
            {this.props.released}
            &nbsp; &#9724;&#xfe0e; &nbsp;
            {this.props.directorIds ? this.props.directorIds.map(id => this.props.directors.get(id)).join(", ") : "Unknown"}
          </div>
        </div>
      </div>
    ) : null;

    const selectedProperty = selectedClass(arg => this.props[arg]);

    return (
      <li ref={li => this.li = li} className={selectedProperty("selected")} data-index={this.props.index}>
        <h1>{this.props.group}</h1>
        <div className={"image" + (this.state.imageURL ? " loaded" : "")} data-title={this.props.title} data-released={this.props.released} onMouseDown={this.handleClick}>
          {stem}
          <img src={this.state.imageURL} title={this.props.title} />
          <ul className="actions" style={{display: "flex", alignItems: "flex-end", position: "absolute", bottom: 0, left: 0, right: 0, height: 50}}>
            <ActionButton className={"watchlist" + selectedProperty("watchlist")} id={this.props.id} onInvoke={this.handleToggleWatchlist} />
            <ActionButton className="watched" id={this.props.id} />
            <ActionButton className={"favorite" + selectedProperty("favorite")} id={this.props.id} onInvoke={this.handleToggleFavorite} />
          </ul>
        </div>
        {details}
      </li>
    );
  }

}

export default Movie;
