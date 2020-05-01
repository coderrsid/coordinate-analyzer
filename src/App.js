import React, { Component } from 'react';
import Uploader from './Containers/Uploader/Uploader';
import MarkedMap from './Containers/MarkedMap/MarkerMap';
import VisualizedData from './Containers/VisualizedData/VisualizedData';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: '',
			uploaded: false,
			categoryChange: {},
			mediumChange: {}
		};
	}

	setData = (recievedData) => {
		this.setState({ data: recievedData });
	};

	handleUpload = (bool) => {
		this.setState({ uploaded: bool });
	};

	handleCategoryChange = (state) => {
		this.setState({ categoryChange: state });
	};

	handleMediumChange = (state) => {
		this.setState({ mediumChange: state });
	};

	render() {
		return (
			<div className="App">
				<div className="uploader">
					<Uploader uploadedHandler={this.handleUpload} setData={this.setData} />
				</div>
				{this.state.data.length ? (
					<div className="map">
						<MarkedMap
							handleCategoryChange={this.handleCategoryChange}
							handleMediumChange={this.handleMediumChange}
							categoryChange={this.state.categoryChange}
							mediumChange={this.state.mediumChange}
							scrollView={this.state.uploaded}
							mapData={this.state.data}
						/>
					</div>
				) : null}
				{this.state.data.length ? (
					<div className="visual">
						<VisualizedData
							mapCategoryChange={this.handleCategoryChange}
							mapMediumChange={this.handleMediumChange}
							mapData={this.state.data}
						/>
					</div>
				) : null}
			</div>
		);
	}
}

export default App;
