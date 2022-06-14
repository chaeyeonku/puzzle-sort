import './App.css';
import Puzzle from './components/puzzle';
import Picture from './components/picture';
import React from 'react';

class App extends React.Component {

    state = {
        pictures: [
          {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5},
          {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}, 
        ],
        chooseBtnDisabled: true,
        imgNum: 0,
    };

    handleClick = picture  => {
        console.log(picture.id, "image clicked");
        this.setState({chooseBtnDisabled: false, imgNum: picture.id});
    }

    handleShowPuzzle = () => {
        let picContainer = document.getElementById("pictureContainer");
        let puzzle = document.getElementById("puzzle-hide");
        let chooseBtn = document.getElementById("chooseBtn");
        picContainer.style.display = "none";
        puzzle.style.display = "flex";
        chooseBtn.style.display = "none";
    }

    handleDisplayImage = () => {
        return this.state.imgNum;
    }

    render() {
        return ( 
        <div className = "App" >
            <div id="pictureContainer">
                {this.state.pictures.map(picture =>
                    <Picture 
                        key={picture.id}
                        picture={picture}
                        onClick={this.handleClick} />
                )}
            </div>
            <button id="chooseBtn" className="btn btn-outline-light" 
                onClick={this.handleShowPuzzle}
                disabled={this.state.chooseBtnDisabled}>Choose</button>
            <div id="puzzle-hide">
                <Puzzle getImg={this.handleDisplayImage} />
            </div>
        </div>
        );
    }
}

export default App;