import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Easing,
  Animated,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Cell from './src/components/cell';
import { BOARD_SIZE, CELL_SIZE, runAnimation } from './src/lib';

export default class App extends Component {
    constructor(props){
        super(props);

        this.moveAnimation = new Animated.Value(Platform.OS === 'android' ? 160 : 290);
        this.animatedView = new Animated.Value(1);
        this.boardWidth = CELL_SIZE * BOARD_SIZE;

        // initialize each cell in the grid 
        this.grid = Array.apply(0, Array(BOARD_SIZE)).map(row => {
            return Array.apply(0, Array(BOARD_SIZE)).map(col => {
                return 0;
            });
        });
    }

    showRetry = () => {
      Animated.spring(this.moveAnimation, {
        toValue: -190,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out
      }).start(
        ()=>{
          Animated.timing(this.animatedView,{
            toValue : 1.4,
            duration : 500,
            useNativeDriver: true,
          }).start(
            ()=>{
              Animated.timing(this.animatedView,{
                toValue : 1,
                duration : 500,
                useNativeDriver: true,
              }).start();
            }
          );
        })
     
    }

    hideRetry = () => {
      runAnimation(this.moveAnimation, Platform.OS === 'android' ? 160 : 290);
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

    reset = () => {
      this.hideRetry();
        for(let i=0; i< BOARD_SIZE; i++){
            for(let j=0; j< BOARD_SIZE; j++){
                this.grid[i][j].reset();
            }
        }
    }

    render() {
      const animatedStyle = { transform : []}
        return (
            <View style={styles.container}>
                <View style={{ width: this.boardWidth, height: this.boardWidth, backgroundColor: '#888888', flexDirection: 'column'}}>
                    {this.renderBoard()}
                </View>
                <Animated.View style={[{ transform: [{translateY: this.moveAnimation}, { scale : this.animatedView }] }]}>
                  <Text style={{ color: '#fff', fontSize: 16 }}> You loose !!! </Text>
              
                  <TouchableOpacity activeOpacity={0.7} onPress={this.reset}>
                    <Animated.View style={[styles.button, animatedStyle]}>
                      <Text style={styles.buttonText}> Retry </Text>
                    </Animated.View>
                  </TouchableOpacity>
                  
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
    },
    button: {
      backgroundColor: '#2196f9',
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },

    buttonText: {
      color: '#fff',
      fontSize: 16,
    }

});
