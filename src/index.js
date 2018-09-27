import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var bigInt = require("big-integer");

var genesis_date = new Date("Mon Sep 24 2018 14:59:48 GMT+0300 (Israel Daylight Time)");

class Cell extends React.Component{
	render(){
		return(
		<div
			className = {this.props.cellClass}
			id = {this.props.id}
		>
			<div className="index">
				{this.props.row * 16 + (15-this.props.col)}
			</div>
		</div>
		)
	}
}

class Grid extends React.Component{
	render(){
		const width = this.props.cols * 16;
		var rowsArr = [];
		var color = this.props.isPrime ? "green" : "black";
		var cellClass = "";
		for (var i=0; i<this.props.rows; i++){
			for (var j=0; j<this.props.cols; j++){
				let cellId = i + "_" + j;
				cellClass = this.props.matrix[i][j] ? "cell " + color : "cell off";
				rowsArr.push(
					<Cell
						cellClass = {cellClass}
						key = {cellId}
						row = {i}
						col = {j}
					/>
					);
			}
		}
		return(
			<div className="grid" style = {{width: width}}>
				{rowsArr}
			</div>
			);
	}
}

class Main extends React.Component{
	constructor(){
		super();
		this.speed = 1000;
		this.rows = 16;
		this.cols = 16;

		this.state = {
			matrix: Array(this.rows).fill(Array(this.cols).fill(false))﻿,
			counter: bigInt(this.getPassedSeconds()),
			isPrime: false,
			isLoaded: false,
			error: null
		}
	}

	getPassedSeconds = () =>{
		var now = new Date();
		return Math.floor((now.getTime() - genesis_date.getTime())/1000);
	}

	runCounter = () =>{
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.count, this.speed);
	}

	count = () =>{
		let g = arrayClone(this.state.matrix);
		var counterArr = this.state.counter.toArray(2).value.reverse();
		var isProbPrime = this.state.counter.isProbablePrime();
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
					g[i][j] = counterArr[i * this.rows + (15-j)] ? true : false;
			}
		}
		this.setState({
		  matrix: g,
		  counter: this.state.counter.add(1),
		  isPrime: isProbPrime
		});
	}

	// fetchTime = () =>{
	// 	fetch("http://localhost:3001")
	//       .then(res => res.json())
	//       .then(
	//         (result) => {
	//           this.setState({
	//             isLoaded: true,
	//             counter: bigInt(result.clock)
	//           });
	//         },
	//         // Note: it's important to handle errors here
	//         // instead of a catch() block so that we don't swallow
	//         // exceptions from actual bugs in components.
	//         (error) => {
	//           this.setState({
	//             isLoaded: true,
	//             error
	//           });
	//         }
	//       )
	// }
	componentDidMount() {
		// this.fetchTime();
		this.runCounter();
	}
	render(){
		// const error = this.state.error;
		// if (error) {
	 //      return <div>Error: {error.message}</div>;
	 //    }
	 //    else if (!this.state.isLoaded) {
	 //      return <div>Loading...</div>;
	 //    }
	 //    else{
			return(
				<div>
					<h1>256 bit-map counter</h1>
					<Grid
						matrix={this.state.matrix}
						rows={this.rows}
						cols={this.cols}
						isPrime={this.state.isPrime}
					/>
					<h2> {this.state.counter.minus(1).toString(10)}</h2>
					<p> seconds have passed since {genesis_date.toLocaleString("he-IL")} </p>
				</div>
			);
		// }
	}
}

function arrayClone(arr) {
	return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main/>, document.getElementById('root'));
