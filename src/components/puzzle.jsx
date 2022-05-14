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
        var img = new Image();
        // img.src = "https://picsum.photos/200/300";
        img.src = require("../images/nature.jpg");

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

        // update state
        this.setState({array: initialArray});

        console.log(initialArray);

        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        let c2 = document.getElementById("myCanvas2");
        let ctx2 = c2.getContext("2d");

        let x, y, newX, newY;

        // render shuffled puzzle on canvas
        // for (let i = 0; i < this.state.numOfPieces; i++) {
        //     x = initialArray[i] % this.state.width;
        //     y = initialArray[i] / this.state.width;

        //     newX = i % this.state.width;
        //     newY = i / this.state.width;

        //     var imgData = ctx.getImageData(x, y, 1, 1);
        //     ctx2.putImageData(imgData, newX, newY);
        // }

        // animated shuffle
        let count = 0;
        let max = this.state.numOfPieces;
        let width = this.state.width;
        const id = setInterval(drawPiece, 10);
        function drawPiece() {
            if ( count < max-1 ) {
                for (let i = 0; i < width; i++) {
                    x = initialArray[count] % width;
                    y = initialArray[count] / width;

                    newX = count % width;
                    newY = count / width;

                    var imgData = ctx.getImageData(x, y, 1, 1);
                    ctx2.putImageData(imgData, newX, newY);

                    count++;
                }
                
            } else {
                clearInterval(id);
            }
        }
    };

    handleSort = () => {
        console.log("Clicked Sort");
        
        let array = this.state.array;
        let numOfPieces = this.state.numOfPieces;

        quicksort(array, 0, numOfPieces-1);

        // helper that picks a pivot and sorts other elements
        function partition(array, low, high) {
            let pivot = array[high];

            let position = low - 1;

            for (let i = low; i <= high - 1; i++) {
                if (array[i] < pivot) {
                    position++;

                    // swap
                    [array[i], array[position]] = [array[position], array[i]];
                }
            }

            [array[high], array[position + 1]] = [array[position + 1], array[high]];

            return position + 1;
        }

        // do quicksort
        function quicksort(array, low, high) {
            if (low < high) {
                let pivot = partition(array, low, high);

                quicksort(array, low, pivot - 1);
                quicksort(array, pivot + 1, high);

            }
        };

        console.log(array);

        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        let c2 = document.getElementById("myCanvas2");
        let ctx2 = c2.getContext("2d");

        let x, y, newX, newY;

        // render shuffled puzzle on canvas
        for (let i = 0; i < numOfPieces; i++) {
            x = array[i] % this.state.width;
            y = array[i] / this.state.width;

            newX = i % this.state.width;
            newY = i / this.state.width;

            var imgData = ctx.getImageData(x, y, 1, 1);
            ctx2.putImageData(imgData, newX, newY);
        }

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
                    <canvas id="myCanvas2" width="500" height="500" 
                            style={{border: '2px solid #000',
                                    backgroundColor: 'white'}}></canvas> 
                    <canvas id="myCanvas" width="500" height="500" 
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