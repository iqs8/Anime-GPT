import React, { Component } from 'react';
import './App.css';
import './fonts.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errorMessage: ''
    };
  }

  onInputChange = (event) => {
    const email = event.target.value;
    this.setState({ email });
  };

  onButtonSubmit = () => {
    const { email } = this.state;
    if (this.validateEmail(email)) {
      
      fetch('your server/test', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
      })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          // Success
          this.setState({ errorMessage: 'Thanks for subscribing!' });
        } else {
          // Error
          this.setState({ errorMessage: data.errorMessage });
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({ errorMessage: 'Failed to subscribe' });
      });
    } else {
      this.setState({ errorMessage: 'Invalid email address' });
    }
  };
  
  
  

  validateEmail = (email) => {
    // Simple email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  render() {
    const { email, errorMessage } = this.state;
    return (
      
      <div className="App">
        <header className="App-header">
          <h1 className="title">ANIME-GPT</h1>
          <p className="sub-text">Daily news from AnimeNewsNetwork summarized by AI <br />and sent to you every day at 7:50PM.</p>
          <div className="input-container">
            <input
              type="email"
              className="subscribe-input"
              placeholder="Enter your email to subscribe"
              value={email}
              onChange={this.onInputChange}
            />
            <button className="subscribe-btn" onClick={this.onButtonSubmit}>
              Subscribe
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p className="unsubscribe">You can unsubscribe at any time.</p>
        </header>
        
      <br></br>
      <br></br>



        <div className="image-container">
          <div className='box1'>
            <p className='test'>Sample newsletter</p>
            
            <div className="image-wrappernews">
                <img
                  src="SampleNewsletter.png"
                  alt="Sample newsletter screenshot"
                  className="long-image"
                />
            </div>
          </div>

          <div className='box2'>
            <p className='test1'>Please subscribe!</p>
            
            <div className="image-wrapperanime">
              <img
                src="333268824057211.png" 
                alt="something different"
                className="long-image"
            />
          </div>
        </div>

      </div>
        
      </div>
    );
  }
}

export default App;
