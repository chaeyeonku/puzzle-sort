import './App.css';
import Puzzle from './components/puzzle';
import Picture from './components/picture';
import React from 'react';
import Button from '@mui/material/Button';

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
        this.setState({chooseBtnDisabled: false, imgNum: picture.id});
    }

    handleShowPuzzle = () => {
        this.setState({chooseBtnDisabled: true});
        let picContainer = document.getElementById("pictureContainer");
        let puzzle = document.getElementById("puzzle-hide");
        picContainer.style.display = "none";
        puzzle.style.display = "flex";
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
            <Button variant="contained" color="success"
                    onClick={() => this.handleShowPuzzle()}
                    disabled={this.state.chooseBtnDisabled}>
                SELECT
            </Button>
            <div id="puzzle-hide">
                <Puzzle getImg={this.handleDisplayImage} />
            </div>
        </div>
        );
    }
}

export default App;