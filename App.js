import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Button,
  Animated,
  Text
} from 'react-native';
import Cell from './src/components/cell';
import { BOARD_SIZE, CELL_SIZE, runAnimation } from './src/lib';

export default class App extends Component {
    constructor(props){
        super(props);

        this.moveAnimation = new Animated.Value(160);
        
        this.boardWidth = CELL_SIZE * BOARD_SIZE;

        // initialize each cell in the grid 
        this.grid = Array.apply(0, Array(BOARD_SIZE)).map(row => {
            return Array.apply(0, Array(BOARD_SIZE)).map(col => {
                return 0;
            });
        });
    }

    showRetry = () => {
      runAnimation(this.moveAnimation, -150);
    }

    hideRetry = () => {
      runAnimation(this.moveAnimation, 160);
    }

    onDie = () => {
        this.showRetry();
        for(let i=0; i< BOARD_SIZE; i++){
            for(let j=0; j< BOARD_SIZE; j++){
                this.grid[i][j].unveil();
            }
        }
    }

    showNeighbors = (x, y) => {
        for(let row=-1;row<=1;row++){
            for(let col=-1;col<=1;col++){
                if ((row != 0 || col != 0) && x + row >= 0 && x + row <= BOARD_SIZE - 1 && y + col >= 0 && y + col <= BOARD_SIZE - 1){
                    this.grid[x + row][y + col].onOpen(false);
                }
            }
        }
    }

     // onOpen get the mines around the cell by going to the -1 and +1 of both the column and row

    onOpen = (x, y) => {
        let neighbors = 0;
        for(let row=-1;row<=1;row++){
            for(let col=-1;col<=1;col++){
              //ensuring the row and column falls within the boardSize which i the size of the array that forms the grid BOARD_SIZE - 1 [0 - 9]
               if (x + row >= 0 && x + row <= BOARD_SIZE - 1 && y + col >= 0 && y + col <= BOARD_SIZE - 1){
                    if (this.grid[x + row][y + col].state.isMine){
                        neighbors++;
                    }
                }
            }
        }

        if (neighbors){
            this.grid[x][y].setState({
                neighbors: neighbors
            })
        } else {
            this.showNeighbors(x, y);
        }
    }

    renderBoard = () => {
        return Array.apply(0, Array(BOARD_SIZE)).map((cell, rowIndex) => {
            let cells = Array.apply(0, Array(BOARD_SIZE)).map((cell, colIndex) => {
                return <Cell
                    onOpen={this.onOpen}
                    onDie={this.onDie}
                    key={colIndex}
                    x={colIndex}
                    y={rowIndex}
                    ref={(ref) => { this.grid[colIndex][rowIndex] = ref }}
                />
            });

            return (
                <View key={rowIndex} style={{ width: this.boardWidth, height: CELL_SIZE, flexDirection: 'row'}}>
                    {cells}
                </View>
            )
        });


    }

    resetGame = () => {
      this.hideRetry();
        for(let i=0; i< BOARD_SIZE; i++){
            for(let j=0; j< BOARD_SIZE; j++){
                this.grid[i][j].reset();
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ width: this.boardWidth, height: this.boardWidth, backgroundColor: '#888888', flexDirection: 'column'}}>
                    {this.renderBoard()}
                </View>
                <Animated.View style={{ transform: [{translateY: this.moveAnimation}] }}>
                  <Text style={{ color: '#fff' }}> You loose !!! </Text>
                  <Button title="Retry" onPress={this.resetGame} />
                </Animated.View>
              
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
});
