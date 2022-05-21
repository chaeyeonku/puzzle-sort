import React from 'react';
import '../App.css';

class Puzzle extends React.Component {

    state = {
        width: 0,
        height: 0,
        numOfPieces: 0,
        sizeofPiece: 64,
        level: 1,
        shuffleDisabled: true,
        sortDisabled: true,
        upDisabled: true,
        downDisabled: true,
        array: []
    };

    /** Resets the state by reloading window */
    handleReset = () => {
        window.location.reload();
    };

    /** Increases the size of a puzzle piece */
    handleUp = () => {
        // width/height of a puzzle piece (in pixels) for each level
        // index corresponds to the level (e.g. level 0-3)
        let levels = [32, 64, 128, 256];

        let currentLevel = this.state.level;

        if (currentLevel < 3) {
            currentLevel++;
        }

        // calculate new total number of pieces
        let totalPieces = Math.pow((512 / levels[currentLevel]), 2);

        this.setState(
            {level: currentLevel, sizeOfPiece: levels[currentLevel], numOfPieces: totalPieces}
        );

        // disable/enable up/down buttons if necessary
        if (currentLevel === 3) {
            this.setState({upDisabled: true});
        } else {
            this.setState({upDisabled: false, downDisabled: false});
        }
        
    };

    /** Decreases the size of a puzzle piece */
    handleDown = () => {
        // width/height of a puzzle piece (in pixels) for each level
        // index corresponds to the level (e.g. level 0-3)
        let levels = [32, 64, 128, 256];

        let currentLevel = this.state.level;

        if (currentLevel > 0) {
            currentLevel--;
        }

        // calculate new total number of pieces
        let totalPieces = Math.pow((512 / levels[currentLevel]), 2);

        this.setState(
            {level: currentLevel, sizeOfPiece: levels[currentLevel], numOfPieces: totalPieces}
        );

        // disable/enable up/down buttons if necessary
        if (currentLevel === 0) {
            this.setState({downDisabled: true});
        } else {
            this.setState({upDisabled: false, downDisabled: false});
        }
        
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
        this.setState({shuffleDisabled: false, upDisabled: false, downDisabled: false});

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

        // disable shuffle & sort button
        this.setState({shuffleDisabled: true, sortDisabled: true});

        // get puzzle details
        let sizeOfPiece = this.state.sizeOfPiece;
        let array = this.state.array;
        let width = this.state.width;
        let numOfPieces = this.state.numOfPieces;

        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        let c2 = document.getElementById("myCanvas2");
        let ctx2 = c2.getContext("2d");

        // create an arbitray sorted array for comparison
        let sortedArray = [];

        // create an array of number from 0 - numOfPieces - 1
        for (let i = 0; i < numOfPieces; i++) {
        // for (let i = 0; i < 16; i++) {
            sortedArray[i] = i;
        }

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

                    // check if the puzzle has been completely sorted
                    if (JSON.stringify(sortedArray) === JSON.stringify(array)) {

                        // wait for 5 seconds and call reset
                        window.setTimeout(function() {
                            window.location.reload();
                        }, 5000);

                    }

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
                <button id="resetBtn" className="btn btn-secondary" onClick={this.handleReset}>Reset</button>

                <div className="upDownContainer">
                    <label>Change puzzle piece size: </label>
                    <button id="up" className="upDown" onClick={this.handleUp} 
                        disabled={this.state.upDisabled}>▲</button>
                    <button id="down" className="upDown" onClick={this.handleDown} 
                        disabled={this.state.downDisabled}>▼</button>
                </div>
                
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