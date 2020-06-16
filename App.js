import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Easing,
  Button,
  Animated,
  Text
} from 'react-native';
import Cell from './src/components/cell';
import { BOARD_SIZE, CELL_SIZE } from './src/lib';

export default class App extends Component {
    constructor(props){
        super(props);

        this.moveAnimation = new Animated.Value(160);
        
        this.boardWidth = CELL_SIZE * BOARD_SIZE;
        this.grid = Array.apply(0, Array(BOARD_SIZE)).map(row => {
            return Array.apply(0, Array(BOARD_SIZE)).map(col => {
                return 0;
            });
        });
    }

    showRetry = () => {
      Animated.spring(this.moveAnimation, {
        toValue: -150,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out
      }).start();
    }

    hideRetry = () => {
      Animated.spring(this.moveAnimation, {
        toValue: 160,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.inOut,
        
      }).start();
    }

    onDie = () => {
        this.showRetry();
        for(let i=0; i< BOARD_SIZE; i++){
            for(let j=0; j< BOARD_SIZE; j++){
                this.grid[i][j].revealWithoutCallback();
            }
        }
    }

    revealNeighbors = (x, y) => {
        for(let row=-1;row<=1;row++){
            for(let col=-1;col<=1;col++){
                if ((row != 0 || col != 0) && x + row >= 0 && x + row <= BOARD_SIZE - 1 && y + col >= 0 && y + col <= BOARD_SIZE - 1){
                    this.grid[x + row][y + col].onOpen(false);
                }
            }
        }
    }

    onOpen = (x, y) => {
      // get the mines around the cell by going to the -1 and +1 of both the column and row
        let neighbors = 0;
        for(let row=-1;row<=1;row++){
            for(let col=-1;col<=1;col++){
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
            this.revealNeighbors(x, y);
        }
    }

    renderBoard = () => {
        return Array.apply(null, Array(BOARD_SIZE)).map((cell, rowIdx) => {
            let cells = Array.apply(null, Array(BOARD_SIZE)).map((cell, colIdx) => {
                return <Cell
                    onOpen={this.onOpen}
                    onDie={this.onDie}
                    key={colIdx}
                    x={colIdx}
                    y={rowIdx}
                    ref={(ref) => { this.grid[colIdx][rowIdx] = ref }}
                />
            });

            return (
                <View key={rowIdx} style={{ width: this.boardWidth, height: CELL_SIZE, flexDirection: 'row'}}>
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
                  <Text> You loose !!! </Text>
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
