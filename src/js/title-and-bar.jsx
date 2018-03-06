import React from 'react';
import { Line } from 'rc-progress';
import chroma from 'chroma-js';
const scale = chroma.scale([ '#C73955', '#F4CC3D', '#40916A']).domain([0, 100]).classes(10).mode('lab');

class TitleAndBar extends React.Component {

  getPercent() {
    const { value, max } = this.props;
    const percent = value / max * 100;
    return parseInt(percent, 10);
  }

  getStrokeColor() {
    return scale(this.getPercent()).hex();
  }

  render() {
    const { title, value, max } = this.props;

    return (
      <div className="+push-bottom">
        <span>{title}</span>
        <div style={{ position: 'relative' }}>
          <Line
            strokeLinecap="square"
            strokeWidth={6}
            trailWidth={6}
            strokeColor={this.getStrokeColor()}
            percent={this.getPercent()}
          />
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
            {`${value} / ${max}`}
          </div>
        </div>
      </div>
    );
  }
}

export default TitleAndBar;
