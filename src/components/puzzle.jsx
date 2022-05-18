import React from 'react';
import '../App.css';

class Puzzle extends React.Component {
    state = {
        width: 0,
        height: 0,
        numOfPieces: 0,
        sizeofPiece: 0,
        shuffleDisabled: true,
        sortDisabled: true,
        array: []
    };

    /**  Puts the original image on the canvas */
    handleDisplay = () => {
        console.log("Clicked Display");

        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        var img = new Image();
        // img.src = "https://picsum.photos/200/300";
        img.src = require("../images/image.jpg");

        // wait for the image to load first
        img.onload = () => {

            // draw the image scaled to 512 x 512 dimension
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 512, 512);

            // initialize puzzle information
            this.setState(
                {width: 512, height: 512, sizeOfPiece: 64}
            );

            // set number of pieces
            let totalPieces = Math.pow((512 / 64), 2);
            this.setState({numOfPieces: totalPieces});
        };

        // enable shuffle button
        this.setState({shuffleDisabled: false});

    };

    /** Shuffles the picture puzzle */
    handleShuffle = () => {
        console.log("Clicked Shuffle");

        // get puzzle details
        let numOfPieces = this.state.numOfPieces;
        let sizeOfPiece = this.state.sizeOfPiece;

        // hide original canvas
        var origCanvas = document.getElementById("myCanvas");
        origCanvas.style.display = "none";

        let initialArray = [];

        // create an array of number from 0 - numOfPieces - 1
        for (let i = 0; i < numOfPieces; i++) {
        // for (let i = 0; i < 16; i++) {
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
        // let max = this.state.numOfPieces;
        let width = this.state.width;
        const id = setInterval(drawPiece, 10);
        function drawPiece() {
            if ( count < numOfPieces ) {
                for (let i = 0; i < width / sizeOfPiece; i++) {
                    x = (initialArray[count] * sizeOfPiece) % width;
                    y = Math.floor((initialArray[count] * sizeOfPiece) / width) * sizeOfPiece;

                    newX = (count * sizeOfPiece) % width;
                    newY = Math.floor((count * sizeOfPiece) / width) * sizeOfPiece;

                    var imgData = ctx.getImageData(x, y, sizeOfPiece, sizeOfPiece);
                    ctx2.putImageData(imgData, newX, newY);

                    count++;
                }
                
            } else {
                clearInterval(id);
            }
        }

        // enable sort button
        this.setState({sortDisabled: false});

    };

    /** Quicksorts the picture puzzle */
    handleSort = () => {
        console.log("Clicked Sort");

        // get puzzle details
        let sizeOfPiece = this.state.sizeOfPiece;
        let array = this.state.array;
        let width = this.state.width;
        let numOfPieces = this.state.numOfPieces;

        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        let c2 = document.getElementById("myCanvas2");
        let ctx2 = c2.getContext("2d");

        let low = 0;
        let high = array.length - 1;
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

            // loop through all elements and do comparision to the pivot
            for (let i = low; i <= high - 1; i++) {
                if (array[i] < pivot) {
                    position++;

                    // swap
                    [array[i], array[position]] = [array[position], array[i]];
                }
            }

            // find the right location for the pivot
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

        // draws current state of puzzle based on partially sorted array
        function drawCurrentPuzzle() {
            let x, y, newX, newY;

            for (let i = 0; i < numOfPieces; i++) {
                x = (array[i] * sizeOfPiece) % width;
                y = Math.floor((array[i] * sizeOfPiece) / width) * sizeOfPiece;
    
                newX = (i * sizeOfPiece) % width;
                newY = Math.floor((i * sizeOfPiece) / width) * sizeOfPiece;

                var imgData = ctx.getImageData(x, y, sizeOfPiece, sizeOfPiece);
                ctx2.putImageData(imgData, newX, newY);
            }
            
        }

    };

    render() {
        return (
            <div className="container">
                <button id="displayBtn" className="btn btn-light" onClick={this.handleDisplay}>Display</button>
                <button id="shuffleBtn" className="btn btn-danger" onClick={this.handleShuffle} 
                    disabled={this.state.shuffleDisabled}>Shuffle</button>
                <button id="sortBtn" className="btn btn-info" onClick={this.handleSort} 
                    disabled={this.state.sortDisabled}>Sort</button>
                
                <li>Scaled Dimension: {this.state.width} x {this.state.height}</li>
                <li>Size of a single piece: {this.state.sizeOfPiece} x {this.state.sizeOfPiece}</li>
                <li>Number of Pieces: {this.state.numOfPieces}</li>
                <div className="canvas-container">
                    <canvas id="myCanvas2" width="512" height="512" 
                            style={{border: '2px solid #000',
                                    backgroundColor: 'white'}}></canvas> 
                    <canvas id="myCanvas" width="512" height="512" 
                        style={{border: '2px solid #000',
                                backgroundColor: 'white'}}></canvas>
                          
                </div>
                
            </div>
        );
    }

    
}

export default Puzzle;