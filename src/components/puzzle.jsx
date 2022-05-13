import React from 'react';
import '../App.css';

class Puzzle extends React.Component {
    state = {
        width: 0,
        height: 0,
        numOfPieces: 0,
        array: []
    };

    handleDisplay = () => {
        console.log("Clicked Display");
        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        const img = new Image();
        // img.src = "https://picsum.photos/200/300";
        img.src = require("../images/img2.jpg");

        img.onload = () => {
            ctx.drawImage(img, 0, 0);

            // initialize puzzle information
            this.setState(
                {width: img.width, height: img.height, 
                    numOfPieces: img.width * img.height}
            );
        };

    };

    handleShuffle = () => {
        console.log("Clicked Shuffle");

        // hide original canvas
        var origCanvas = document.getElementById("myCanvas");
        origCanvas.style.display = "none";

        let initialArray = [];

        // create an array of number from 0 - numOfPieces - 1
        for (let i = 0; i < this.state.numOfPieces; i++) {
            initialArray[i] = i;
        }

        // shuffle puzzle pieces
        initialArray.sort( () => Math.random() - 0.5);

        this.setState({array: initialArray});

        console.log(initialArray);

        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        let c2 = document.getElementById("myCanvas2");
        let ctx2 = c2.getContext("2d");

        let x, y, newX, newY;

        // render shuffled puzzle on canvas
        for (let i = 0; i < this.state.numOfPieces; i++) {
            x = initialArray[i] % this.state.width;
            y = initialArray[i] / this.state.width;

            newX = i % this.state.width;
            newY = i / this.state.width;

            var imgData = ctx.getImageData(x, y, 1, 1);
            ctx2.putImageData(imgData, newX, newY);
        }
    };

    handleSort = () => {
        console.log("Clicked Sort");
    };

    render() {
        return (
            <div className="container">
                <button onClick={this.handleDisplay}>Display</button>
                <button onClick={this.handleShuffle}>Shuffle</button>
                <button onClick={this.handleSort}>Sort</button>
                <h5>Width: {this.state.width}</h5>
                <h5>Height: {this.state.height}</h5>
                <h5>Number of Pieces: {this.state.numOfPieces}</h5>
                <div className="canvas-container">
                    <canvas id="myCanvas2" width="500" height="200" 
                            style={{border: '2px solid #000',
                                    backgroundColor: 'white'}}></canvas> 
                    <canvas id="myCanvas" width="500" height="200" 
                        style={{border: '2px solid #000',
                                backgroundColor: 'white'}}></canvas>
                          
                </div>
                
            </div>
        );
    }

    
}

// gradient puzzle 
export function displayPuzzles() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    const array = [];
    // initialize random array
    for (let i = 0; i < 100; i++) {
        array[i] = i;
    }

    array.sort( () => Math.random() - 0.5);

    console.log(array);

    for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(166, 193, 238, ${array[i] * 0.01})`;
        ctx.fillRect( i*5, 0, 5, 90);
        ctx.fillStyle = `rgba(250, 217, 234, ${array[i] * 0.01})`;
        ctx.fillRect( i*5, 90, 5, 90);
    }
}

export function displayPicture() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    const img = new Image();
    // img.src = "https://picsum.photos/200/300";
    img.src = require("../images/img2.jpg");
    img.onload = function () {ctx.drawImage(img, 0, 0)};
}

export default Puzzle;