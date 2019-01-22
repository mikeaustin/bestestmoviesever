// @flow

export default class Keyboard extends React.PureComponent {
  render() {
    return (
      <div className="keyboard" style={{position: "fixed", bottom: 0, display: "flex", flexDirection: "column"}}>
        <div className="row">
          <div className="key" onTouchStart={event => console.log(event)}>q</div>
          <div className="key">w</div>
          <div className="key">e</div>
          <div className="key">r</div>
          <div className="key">t</div>
          <div className="key">y</div>
          <div className="key">u</div>
          <div className="key">i</div>
          <div className="key">o</div>
          <div className="key">p</div>
        </div>
        <div className="row">
          <div className="key" style={{flex: 0.5, marginRight: 0, visibility: "hidden"}}>a</div>
          <div className="key">a</div>
          <div className="key">s</div>
          <div className="key">d</div>
          <div className="key">f</div>
          <div className="key">g</div>
          <div className="key">h</div>
          <div className="key">j</div>
          <div className="key">k</div>
          <div className="key">l</div>
          <div className="key" style={{flex: 0.5, marginLeft: 0, visibility: "hidden"}}>a</div>
        </div>
        <div className="row">
          <div className="key">&#8679;</div>
          <div className="key" style={{flex: 0.5, marginRight: 0, visibility: "hidden"}}>a</div>
          <div className="key">z</div>
          <div className="key">x</div>
          <div className="key">c</div>
          <div className="key">v</div>
          <div className="key">b</div>
          <div className="key">n</div>
          <div className="key">m</div>
          <div className="key" style={{flex: 0.5, marginLeft: 0, visibility: "hidden"}}>a</div>
          <div className="key" style={{fontSize: 15}}>&#9003;</div>
        </div>
        <div className="row">
          <div className="key" style={{flex: 0.4, marginRight: 0}}>123</div>
          <div className="key" style={{flex: 0.1, marginRight: 0, visibility: "hidden"}}>a</div>
          <div className="key" style={{xflex: 2, marginRight: 0}}></div>
          <div className="key" style={{flex: 0.1, marginLeft: 0, visibility: "hidden"}}>a</div>
          <div className="key" style={{flex: 0.4, marginRight: 0}}>search</div>
        </div>
      </div>
    );
  }  
}
