import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      'break-length': 5,
      'session-length': 25,
       heading: 'Session',
      'Switch': false,
       minutes: 25,
       seconds: 0,
       'play-button': 'START',
    }
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleSS = this.handleSS.bind(this);
    this.countDown = this.countDown.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }


  // After render, will check every 1s to see if Switch is activated to activate 
  // the equations below. Countdown might be slightly out of sync but it's unnoticeable
  componentDidMount(){
    setInterval(this.countDown, 1000);
    setInterval(this.changeColor, 1000);
    setInterval(document.getElementById('session').style.opacity = 100, 2000);
    setInterval(document.getElementById('break').style.opacity = 100, 2000);
    setInterval(document.getElementById('display-wrapper').style.opacity = 100, 2000);
  }

  //Increases break or session length by one with each click
  handleIncrement(e){
    let target = e.target.id;

    if(this.state.Switch === false){
      if (target === 'break-increment' && this.state['break-length'] < 60){
        this.setState({'break-length': this.state['break-length'] + 1})
      }
      if (target === 'session-increment' && this.state['session-length'] < 60){
        this.setState({
          'session-length': this.state['session-length'] + 1,
          'minutes': this.state['session-length'] + 1,
        });
      }

      this.setState({seconds:0});
      document.getElementById('color-wrapper').style.color = '#E0AAFF';
    }
  }

  //Decreases break or session length by one with each click
  handleDecrement(e){
    let target = e.target.id;

    if(this.state.Switch === false){
      target === 'break-decrement' && this.state['break-length'] > 1 ?
        this.setState({'break-length': this.state['break-length'] - 1}) :
      target === 'session-decrement' && this.state['session-length'] > 1 ?
        this.setState({
          'session-length': this.state['session-length'] - 1,
          'minutes': this.state['session-length'] - 1,
        }):
      target !== 'break-decrement' ?
        this.setState({'minutes': 1}):
        this.setState({'break-length': 1});

      this.setState({seconds:0});
      document.getElementById('color-wrapper').style.color = '#E0AAFF';
    }
  }

  // Handles the start stop switch for the session timer
  handleSS(e){
    if (this.state.Switch === false) {
      this.setState({
        Switch: true,
        'play-button':'STOP'
      })
    } else{
      this.setState({
        Switch: false,
        'play-button':'START'
      });
    }
      
    }

  // Used in componentDidMount above for counting down the time for session and break times
  countDown(){
    let seconds = this.state.seconds;
    let minutes = this.state.minutes;

    if (this.state.Switch === true){
      if (seconds !== 0){
        this.setState({seconds: seconds - 1})
      } else if (minutes !== 0){
        this.setState({
          minutes: minutes - 1,
          seconds: 59,
        });
      } else if (this.state.heading === 'Session'){
        document.getElementById('beep').play();
        this.setState({
          heading: 'Break',
          minutes: this.state['break-length'],
      });
        
      } else {
        document.getElementById('beep').play();
        this.setState({
          heading: 'Session',
          minutes: this.state['session-length'],
        });
        
      }

    }
  }

  // Changes color upon timer dropping below 1 minute
  changeColor(){
    let seconds = this.state.seconds;
    let minutes = this.state.minutes;
    let display = document.getElementById('color-wrapper');

    if(this.state.Switch === true){
      minutes === 0 && seconds < 60?
        display.style.color = 'red':
        display.style.color = '#E0AAFF';
      
    }
  }

  handleReset(){
    this.setState({
      Switch: false, 
      minutes: 25,
      seconds: 0,
      'session-length': 25,
      'break-length': 5,
      heading: 'Session',
      'play-button':'START'
    });
    document.getElementById('color-wrapper').style.color = '#E0AAFF';
    document.getElementById('beep').pause();
    document.getElementById('beep').currentTime = 0;
  }

  render(){
    return (
    <div className="App">
    <h1 id = 'title'>Pomodoro Clock</h1>
      <div id = 'clock-wrapper'>
        <div id = 'session' className = 'controls'>
          <div className = 'circle-wrapper'>
            <h2 id = 'session-label'>Session Length</h2>
            <div className = 'time-control-wrapper'>
              <i className="gg-arrow-down" id = 'session-decrement' onClick = {this.handleDecrement}></i>
              <h2 id = 'session-length'>{this.state['session-length']}</h2>
              <i className="gg-arrow-up" id = 'session-increment' onClick = {this.handleIncrement}></i>
            </div>
          </div>
        </div>

        <div id = 'display-wrapper'>
          <div id = 'color-wrapper'>
            <h2 id = 'timer-label'>{this.state.heading}</h2>
            <h1 id = 'time-left'>{this.state['minutes'].toString().padStart(2,'0') + ':' + this.state.seconds.toString().padStart(2,'0')}</h1>
          </div>
          <div id = 'control-wrapper'>
            <button id = 'start_stop' onClick = {this.handleSS}>{this.state['play-button']}</button>
            <button id = 'reset' onClick = {this.handleReset}>RESET</button>
          </div>
        </div>

        <div id = 'break' className = 'controls'>
          <div className = 'circle-wrapper'>
            <h2 id = 'break-label'>Break Length</h2>
            <div className = 'time-control-wrapper'>
              <i className="gg-arrow-down" id = 'break-decrement' onClick = {this.handleDecrement}></i>
              <h2 id = 'break-length'>{this.state['break-length']}</h2>
              <i className="gg-arrow-up" id = 'break-increment' onClick = {this.handleIncrement}></i>
          </div>
            </div>
        </div>
      </div>

      <audio
          id="beep"
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />

    </div>
  );
  }
}

export default App;
