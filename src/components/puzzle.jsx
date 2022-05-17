import React from 'react';
import '../App.css';

class Puzzle extends React.Component {
    state = {
        width: 0,
        height: 0,
        numOfPieces: 0,
        array: []
    };

    /**  Puts the original image on the canvas */
    handleDisplay = () => {
        console.log("Clicked Display");
        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        var img = new Image();
        // img.src = "https://picsum.photos/200/300";
        img.src = require("../images/nature.jpg");

        // wait for the image to load first
        img.onload = () => {
            ctx.drawImage(img, 0, 0);

            // initialize puzzle information
            this.setState(
                {width: img.width, height: img.height, 
                    numOfPieces: img.width * img.height}
            );
        };

    };

    /** Shuffles the picture puzzle */
    handleShuffle = () => {
        console.log("Clicked Shuffle");

        let sizeOfPiece = 64;

        // hide original canvas
        var origCanvas = document.getElementById("myCanvas");
        origCanvas.style.display = "none";

        let initialArray = [];

        // create an array of number from 0 - numOfPieces - 1
        // for (let i = 0; i < this.state.numOfPieces; i++) {
        for (let i = 0; i < 16; i++) {
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

        // animated shuffle
        let count = 0;
        let max = this.state.numOfPieces;
        let width = this.state.width;
        const id = setInterval(drawPiece, 10);
        function drawPiece() {
            // if ( count < max-1 ) {
            if ( count < 16 ) {
                for (let i = 0; i < width / 64; i++) {
                    x = (initialArray[count] * 64) % width;
                    y = Math.floor((initialArray[count] * 64) / width) * 64;

                    newX = (count * 64) % width;
                    newY = Math.floor((count * 64) / width) * 64;

                    var imgData = ctx.getImageData(x, y, sizeOfPiece, sizeOfPiece);
                    ctx2.putImageData(imgData, newX, newY);

                    count++;
                }
                
            } else {
                clearInterval(id);
            }
        }

    };

    /** Quicksorts the picture puzzle */
    handleSort = () => {
        console.log("Clicked Sort");

        let sizeOfPiece = 64;
        
        let array = this.state.array;
        let width = this.state.width;
        let numOfPieces = this.state.numOfPieces;

        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        let c2 = document.getElementById("myCanvas2");
        let ctx2 = c2.getContext("2d");

        let low = 0;
        let high = array.length - 1;
        // let high = numOfPieces - 1;
        let pivotIdx = -1;

        // initial call to quicksort
        quicksort(array, low, high);

        // helper handling recursive calls to quicksort
        function recursiveQuickSort() {
            quicksort(array, low, pivotIdx - 1)
            .then( () => {
                quicksort(array, pivotIdx + 1, high)
            });
        }

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

            return new Promise((resolve) => {
                if (low < high) {

                    // partition the array and get pivot index
                    pivotIdx = partition(array, low, high);
    
                    // update canvas first
                    drawCurrentPuzzle();

                    // do recursive calls to quicksort
                    window.requestAnimationFrame(recursiveQuickSort);
    
                } else {
                    // resolve the promise since there's nothing left to sort
                    resolve();
                }
            });

            
        };

        // animate function
        function drawCurrentPuzzle() {
            let x, y, newX, newY;

            // for (let i = 0; i < numOfPieces; i++) {
            for (let i = 0; i < 16; i++) {
                x = (array[i] * 64) % width;
                y = Math.floor((array[i] * 64) / width) * 64;
    
                newX = (i * 64) % width;
                // newY = i / width;
                newY = Math.floor((i * 64) / width) * 64;

                var imgData = ctx.getImageData(x, y, sizeOfPiece, sizeOfPiece);
                ctx2.putImageData(imgData, newX, newY);
            }
            
        }

        // console.log(array);

    };

    render() {
        return (
            <div className="container">
                <button className="btn btn-light" onClick={this.handleDisplay}>Display</button>
                <button className="btn btn-danger" onClick={this.handleShuffle}>Shuffle</button>
                <button className="btn btn-info" onClick={this.handleSort}>Sort</button>
                
                <li>Dimension: {this.state.width} x {this.state.height}</li>
                <li>Number of Pieces: {this.state.numOfPieces}</li>
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

export default Puzzle;