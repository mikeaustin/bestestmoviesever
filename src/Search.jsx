import React from "react";
import Immutable from "immutable";


class Item extends React.PureComponent {

  handleMouseDown = event => {
    this.props.onShowMovieIds(Immutable.List([this.props.id]));
  }

  render() {
    return (
      <div className="action" style={{padding: "7px 15px", paddingRight: 30, marginRight: 15, fontSize: 20, xlineHeight: "1.5em", cursor: "pointer", background: "right 6px/20px 20px url(icons/analogic-video-camera.svg) no-repeat"}} onMouseDown={this.handleMouseDown}>{this.props.title}</div>
    );
  }

}


export default class Search extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      query: "",
      results: Immutable.List()
    };

    this.movies = this.props.movies.sortBy(movie => movie.get("title")).map(movie => movie.set("lowerCaseTitle", movie.get("title").toLowerCase()));
    //this.directors = this.props.directors.sortBy(director => director).map(director => director.set("lowerCaseName", director.toLowerCase()));
  }

  handleKeyDown = event => {
    event.stopPropagation();
  }

  componentDidMount() {
    this.results.addEventListener("touchstart", this.handleTouchStart, {passive: false});
    this.results.addEventListener("wheel", this.handleScroll, {passive: false});
    this.results.addEventListener("touchmove", this.handleScroll, {passive: false});
  }

  handleTouchStart = event => {
    this.clientY = event.touches ? event.touches[0].clientY : 0;
  }

  handleScroll = event => {
    const element = this.results;
    const clientY = event.touches ? event.touches[0].clientY : 0;
    const deltaY = event.touches ? this.clientY - clientY : event.deltaY;

    if ((deltaY > 0 && element.offsetHeight + element.scrollTop >= element.scrollHeight) ||
        (deltaY < 0 && element.scrollTop <= 0)) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.clientY = clientY;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen) {
      //if (nextProps.isOpen) {
        this.setState({
          query: "",
          results: Immutable.List(),
        });
      //}

      if (nextProps.isOpen) {
        this.input.focus();
      } else {
        this.input.blur();
      }
    }
  }

  handleChange = event => {
    const query = event.target.value;
    const results = query !== "" ? this.movies.filter(movie => movie.get("lowerCaseTitle").includes(query)) : Immutable.List();

    this.setState(state => ({
      query: query,
      results: results
    }));

    this.results.scrollTop = 0;

    //console.log("here", "[" + event.target.value + "]");

    // this.props.onShowMovieIds(query !== "" && results.isEmpty() ? Immutable.List([null]) : results.map(movie => movie.get("id")));
  }

  handleSubmit = event => {
    event.preventDefault();

    this.input.blur();

    this.setState({
      query: "",
      results: Immutable.List()
    })

    this.props.onShowMovieIds(this.state.results.map(movie => movie.get("id")));
  }

  handleClick = event => {
    this.props.onShowSearch();
  }

  handleKeyDown = event => {
    // event.preventDefault();
    // event.stopPropagation();
  }

  handleBlur = event => {
    console.log("here");

    this.props.onHideSearch();
  }

  render() {
    return (
      <div className={"search" + (this.props.isOpen ? " selected" : "")}>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.query} autoCorrect="off" autoCapitalize="none" style={{height: 35, fontSize: 20, paddingTop: 2, width: "100%", background: "transparent", color: "hsl(0, 0%, 20%)"}}
                 ref={element => this.input = element} onClick={this.handleClick} onKeyDown={this.handleKeyDown} onChange={this.handleChange} onBlur={this.handleBlur} />
        </form>
        <div className="results" ref={element => this.results = element} style={{width: "100%", background: "hsla(0, 0%, 0%, 0.9)", borderLeft: "1px solid hsl(0, 0%, 10%)", padding: "10px 0"}}>
          <div></div>
          {this.state.results.map(movie => (
            <Item key={movie.get("id")} id={movie.get("id")} className="action" title={movie.get("title")} style={{padding: "7px 15px", fontSize: 20, cursor: "pointer"}} onShowMovieIds={this.props.onShowMovieIds} />
          ))}
        </div>
      </div>
    );
  }

}