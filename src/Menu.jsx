import React from "react";

import { ListReducer, FilterEventHelper, KeyCode, SortOrder, selectedClass, combineEvery } from "./utils";


export default class Menu extends React.PureComponent {

  constructor(props) {
    super(props);

    this.evenCategories = this.props.categories.sortBy((genre, id) => id).filter((genre, id) => id % 2 == 0).entrySeq();
    this.oddCategories = this.props.categories.sortBy((genre, id) => id).filter((genre, id) => id % 2 != 0).set(-1, null).entrySeq();
  }

  handleTouchStart = event => {
    this.firstX = this.lastX = event.touches[0].clientX;
  }

  handleTouchMove = event => {
    event.preventDefault();
    event.stopPropagation();

    this.lastX = event.touches[0].clientX;
  }

  handleTouchEnd = event => {
    event.stopPropagation();

    if (this.lastX < this.firstX - 50) {
      this.props.onHideMenu();

      this.setState({
        showMenu: false
      });
    }
  }

  render() {
    const selectedProp = selectedClass(arg => this.props[arg]);
    const selectedCategory = selectedClass(arg => this.props.categoryIds.includes(arg));
    const selectedSortOrder = selectedClass(arg => this.props.sortOrder == arg);

    return (
      <div className={"menu" + (this.props.isOpen ? " open" : "")} style={{display: "flex", flexDirection: "column", position: "fixed", bottom: 0, left: 0, top: 0, padding: "72px 20px 0 20px", background: "hsla(0, 0%, 0%, 0.9)", zIndex: 1000}}
           onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}>
        <table>
          <tbody>
            <tr>
              <th>Sort By</th>
            </tr>
            <tr>
              <td className={selectedSortOrder(SortOrder.DESCENDING)} onMouseDown={this.props.onSortYearDescending}>&#9634; &nbsp;Year &nbsp;&#8595;</td>
              <th style={{width: "20px"}}></th>
              <td className={selectedSortOrder(SortOrder.ASCENDING)} onMouseDown={this.props.onSortYearAscending}>&#9634; &nbsp;Year &nbsp;&#8593;</td>
            </tr>
            <tr>
              <th>Show</th>
            </tr>
            <tr>
              <td className={selectedProp("showWatchlist")} onMouseDown={this.props.onShowWatchlist}>&#9634; &nbsp;Watchlist</td>
              <th style={{width: "20px"}}></th>
              <td className={selectedProp("showFavorites")} onMouseDown={this.props.onShowFavorites}>&#9634; &nbsp;Favorites</td>
            </tr>
            <tr>
              <th>Genres</th>
            </tr>
            {this.evenCategories.zipWith((even, odd) => (
              <tr key={even}>
                <td className={selectedCategory(even[0])} onMouseDown={this.props.onChangeCategory(even[0])}>&#9634; &nbsp;{even[1]}</td>
                <th style={{width: "20px"}}></th>
                {odd[1] !== null ? <td className={selectedCategory(odd[0])} onMouseDown={this.props.onChangeCategory(odd[0])}>&#9634; &nbsp;{odd[1]}</td> : null}
              </tr>
            ), this.oddCategories)}
          </tbody>
        </table>
      </div>
    );
  }

}