import React, { Component } from 'react';
import PieChart from './PieChart/PieChart';
import './VisualizedData.css';
import BarChart from './BarChart/BarChart';

export default class VisualizedData extends Component {
	handleCategoryChange = (state) => {
		this.props.mapCategoryChange(state);
	};

	handleMediumChange = (state) => {
		this.props.mapMediumChange(state);
	};

	render() {
		let data = this.props.mapData;

		return (
			<div className="visualContainer">
				<PieChart mapCategoryChange={this.handleCategoryChange} tripCategory={data} />
				<BarChart mapMediumChange={this.handleMediumChange} medium={data} />
			</div>
		);
	}
}
