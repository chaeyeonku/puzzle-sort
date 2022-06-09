import React from 'react';
import '../App.css';

class Puzzle extends React.Component {

    state = {
        width: 0,
        height: 0,
        numOfPieces: 0,
        sizeOfPiece: 16,
        level: 0,
        displayDisabled: false,
        shuffleDisabled: true,
        sortDisabled: true,
        upDisabled: false,
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
        let levels = [16, 32, 64, 128, 256];

        // get current puzzle level
        let currentLevel = this.state.level;

        // increment currentLevel
        if (currentLevel < 5) {
            currentLevel++;
        }

        // calculate the new total number of pieces
        let totalPieces = Math.pow((512 / levels[currentLevel]), 2);

        // update to new state
        this.setState(
            {level: currentLevel, 
            sizeOfPiece: levels[currentLevel], 
            numOfPieces: totalPieces}
        );

        // disable/enable UP/DOWN buttons if necessary
        if (currentLevel === 5) {
            this.setState({upDisabled: true});
        } else {
            this.setState({upDisabled: false, downDisabled: false});
        }
        
    };

    /** Decreases the size of a puzzle piece */
    handleDown = () => {
        // width/height of a puzzle piece (in pixels) for each level
        // index corresponds to the level (e.g. level 0-3)
        let levels = [16, 32, 64, 128, 256];

        // get current puzzle level
        let currentLevel = this.state.level;

        // decrement currentLevel
        if (currentLevel > 0) {
            currentLevel--;
        }

        // calculate the new total number of pieces
        let totalPieces = Math.pow((512 / levels[currentLevel]), 2);

        // update to new state
        this.setState(
            {level: currentLevel, 
            sizeOfPiece: levels[currentLevel], 
            numOfPieces: totalPieces}
        );

        // disable/enable UP/DOWN buttons if necessary
        if (currentLevel === 0) {
            this.setState({downDisabled: true});
        } else {
            this.setState({upDisabled: false, downDisabled: false});
        }
        
    };

    /**  Puts the original image on the canvas */
    handleDisplay = () => {
        console.log("Clicked Display");

        let size = this.state.sizeOfPiece;
        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        var img = new Image();
        img.src = require("../images/image.jpg");

        // wait for the image to load first
        img.onload = () => {

            // draw the image scaled to 512 x 512 dimension
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 512, 512);

            // initialize puzzle information
            this.setState({width: 512, height: 512});

            // set number of pieces
            let totalPieces = Math.pow((512 / size), 2);
            this.setState({numOfPieces: totalPieces});

            // draw borders around each puzzle piece
            let width = img.width;
            for (let i=0; i < width; i += size) {
                for (let j = 0; j < width; j += size) {
                    ctx.strokeRect(i, j, size, size);
                }
            }
        };

        // disable UP/DOWN & DISPLAY buttons and enable SHUFFLE
        this.setState({shuffleDisabled: false, displayDisabled: true,
            upDisabled: true, downDisabled: true});

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

        // create an array of number from 0 to numOfPieces - 1
        for (let i = 0; i < numOfPieces; i++) {
            initialArray[i] = i;
        }

        // shuffle puzzle pieces
        initialArray.sort( () => Math.random() - 0.5);

        // update state
        this.setState({array: initialArray});

        console.log(initialArray);

        // get canvas elements and contexts
        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        let c2 = document.getElementById("myCanvas2");
        let ctx2 = c2.getContext("2d");

        // variables for x,y coordinates
        let x, y, newX, newY;

        // initialize variables for shuffled display
        let count = 0;
        let width = this.state.width;
        const id = setInterval(drawPiece, 10);

        // helper for updating each row of shuffled puzzle
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

        // get canvas elements and their contexts
        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        let c2 = document.getElementById("myCanvas2");
        let ctx2 = c2.getContext("2d");

        let low = 0;
        let high = array.length - 1;

        // initial call to iterative quicksort
        itrQuickSort(array, low, high);

        /** Adapted from GeeksForGeeks - Iterative Quick Sort
         * https://www.geeksforgeeks.org/iterative-quick-sort/ 
         * */ 
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

        /** Adapted from GeeksForGeeks - Iterative Quick Sort
         * https://www.geeksforgeeks.org/iterative-quick-sort/ 
         * */ 
        function itrQuickSort(array, low, high) {
            // create a stack array
            let stack = new Array(high - low + 1);
            stack.fill(0);
      
            // initialize top of stack
            let top = -1;
      
            // push initial values of low and high to stack
            stack[++top] = low;
            stack[++top] = high;
      
            // qs loop that will keep popping from stack until it's empty
            function qsLoop() {
                if (top >= 0) {
                    // Pop high and low
                    high = stack[top--];
                    low = stack[top--];
        
                    // move pivot element to correct index
                    let p = partition(array, low, high);
        
                    // If there are elements on left side of pivot,
                    // then push left side to stack
                    if (p - 1 > low) {
                        stack[++top] = low;
                        stack[++top] = p - 1;
                    }
        
                    // If there are elements on right side of pivot,
                    // then push right side to stack
                    if (p + 1 < high) {
                        stack[++top] = p + 1;
                        stack[++top] = high;
                    }

                    // update the canvas before starting next iteration
                    drawCurrentPuzzle(p);
                    window.requestAnimationFrame(qsLoop);
                }
            }

            // initial call to quicksort Loop
            qsLoop();
        
        }

        // draws current state of puzzle based on partially sorted array
        function drawCurrentPuzzle(pivotIdx) {

            let x, y, newX, newY;

            for (let i = 0; i < numOfPieces; i++) {
                x = (array[i] * sizeOfPiece) % width;
                y = Math.floor((array[i] * sizeOfPiece) / width) * sizeOfPiece;
    
                newX = (i * sizeOfPiece) % width;
                newY = Math.floor((i * sizeOfPiece) / width) * sizeOfPiece;

                var imgData = ctx.getImageData(x, y, sizeOfPiece, sizeOfPiece);
                ctx2.putImageData(imgData, newX, newY);

                // draw a borderline around the current pivot piece
                if (i === pivotIdx) {
                    ctx2.strokeStyle = '#3333ff';
                    ctx2.lineWidth = 5;
                    ctx2.strokeRect(x, y, sizeOfPiece, sizeOfPiece);
                }
            }
        }

    };

    render() {
        return (
            <div className="container">
                <div className="buttons">
                    <button id="displayBtn" className="btn btn-outline-light" onClick={this.handleDisplay}
                        disabled={this.state.displayDisabled}>Display</button>
                    <button id="shuffleBtn" className="btn btn-outline-danger" onClick={this.handleShuffle} 
                        disabled={this.state.shuffleDisabled}>Shuffle</button>
                    <button id="sortBtn" className="btn btn-outline-info" onClick={this.handleSort} 
                        disabled={this.state.sortDisabled}>Sort</button>
                    <button id="resetBtn" className="btn btn-outline-light" onClick={this.handleReset}>Reset</button>
                </div>

                <div className="upDownContainer">
                    <label>Change puzzle piece size: </label>
                    <button id="up" className="upDown" onClick={this.handleUp} 
                        disabled={this.state.upDisabled}>▲</button>
                    <button id="down" className="upDown" onClick={this.handleDown} 
                        disabled={this.state.downDisabled}>▼</button>
                </div>
                <div>Single piece size: {this.state.sizeOfPiece} px</div>
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