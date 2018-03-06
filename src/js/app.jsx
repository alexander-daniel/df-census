import React from 'react';
import TitleAndBar from './title-and-bar';

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
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {this.state.units.map((unit, i) => {
          return (
            <div key={i} className="panel +push-right">

              <div className="heading">
                <h2>{unit.name}</h2>
              </div>

              <div className="body">
                <div className="+push-bottom-double">{unit.profession}</div>

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
        })}
      </div>
    )
  }
}

export default App;
