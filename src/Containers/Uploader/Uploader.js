import React, { Component } from 'react';
import { AwesomeButtonProgress } from 'react-awesome-button';
import 'react-awesome-button/dist/themes/theme-blue.css';
import './Uploader.css';
import uploadIcon from '../../assets/uploadIcon.png';
import Papa from 'papaparse';
import ScrollDown from '../../Components/ScrollDown/ScrollDown';

class Uploader extends Component {
	constructor() {
		super();
		this.state = {
			csvfile: null,
			data: [],
			uploaded: false
		};
	}

	onDrop = (event) => {
		this.setState({
			csvfile: event.target.files[0]
		});
	};

	importCSV = () => {
		const { csvfile } = this.state;
		Papa.parse(csvfile, {
			complete: this.uploadData,
			header: true
		});
		this.props.uploadedHandler(true);
	};

	uploadData = (result) => {
		const data = result.data;
		var markerList = [];
		for (var i = 1; i < data.length; i++) {
			const id = data[i].id;
			const latitude = data[i].from_lat;
			const longitude = data[i].from_long;
			let category = data[i].travel_type_id;
			const web = data[i].online_booking;
			const mobile = data[i].mobile_site_booking;
			if (category === '1') {
				category = 'Long Distance';
			} else if (category === '2') {
				category = 'Point to Point';
			} else if (category === '3') {
				category = 'Hourly Rental';
			} else {
			}
			const markerData = {
				id: id,
				latitude: latitude,
				longitude: longitude,
				category: category,
				web: web,
				mobile: mobile
			};
			markerList.push(markerData);
		}
		this.props.setData(markerList);
	};

	progressAction = (element, next) => {
		this.importCSV();
		setTimeout(() => {
			next();
		}, 1250);
		this.setState({ uploaded: true });
	};

	render() {
		return (
			<div className="uploaderDivContainer">
				<div className="uploaderDiv">
					<img src={uploadIcon} alt="Upload" className="file-upload-icon" />
					<div className={this.state.uploaded ? 'file-upload active' : 'file-upload'}>
						<div className="file-select">
							<div className="file-select-button" id="fileName">
								Choose File
							</div>
							<div className="file-select-name" id="noFile">
								{this.state.csvfile ? `${this.state.csvfile.name}` : 'No file chosen...'}
							</div>
							<input type="file" id="chooseFile" name="file" onChange={(e) => this.onDrop(e)} />
						</div>
					</div>
					<AwesomeButtonProgress
						loadingLabel={'Visualizing Data..'}
						resultLabel={'Done!'}
						type="primary"
						size="large"
						action={this.progressAction}
					>
						VISUALIZE
					</AwesomeButtonProgress>
				</div>
				{this.state.uploaded ? <ScrollDown /> : null}
			</div>
		);
	}
}

export default Uploader;
