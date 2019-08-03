import React from 'react';
import TitleAndBar from './title-and-bar';

class UnitPanel extends React.Component {
  render() {
    const { unit } = this.props;
    return (
      <div className="panel +push-right">

        <div className="heading">
          <h2>{unit.name}</h2>
        </div>

        <div className="body">
          <div>{unit.profession}</div>
          <div className="+push-bottom-double">{`Current Job: ${unit.currentJob}`}</div>
          <ul>
            {unit.skills.map((skill, j) => {
              return (
                <div key={j} className="+push-bottom">
                  <TitleAndBar title={skill.name} max={skill.maxXp} value={skill.xp} />
                  {`${skill.ratingCaption}`}
                </div>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      units: []
    };
  }
  async componentDidMount() {
    const res = await fetch('/units')
    const json = await res.json();
    this.setState({ units: json });
  }

  render() {
    if (!this.state.units.length) {
      return null;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {this.state.units.map((unit, i) => {
          return (
            <div key={i} style={{ border: '1px solid black', padding: '5px', width: '300px' }}>
              <h3>{unit.name}</h3>
              <h4>{unit.profession}</h4>
            </div>
          );
        })}
      </div>
    )
  }
}

export default App;
