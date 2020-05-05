import React, { Component } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import './BarChart.css';

export default class BarChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			medium: ''
		};
	}

	calculateMedium = (data) => {
		let web = 0,
			mobile = 0;

		for (let i = 0; i < data.length; i++) {
			if (data[i].web !== '0') {
				++web;
			}
			if (data[i].mobile !== '0') {
				++mobile;
			}
		}

		const bookingMedium = [
			{
				medium: 'Web',
				Web: web
			},
			{
				medium: 'Mobile',
				Mobile: mobile
			}
		];

		return bookingMedium;
	};

	handleOnclick = (e) => {
		let category = e['id'];

		if (category === 'Web') {
			this.setState({ medium: 'Web' });
		} else if (category === 'Mobile') {
			this.setState({ medium: 'Mobile' });
		}
		console.log(this.state.medium);
		this.props.mapMediumChange(this.state.medium);
	};

	render() {
		let recievedData = this.calculateMedium(this.props.medium);
		return (
			<div className="barContainer">
				<h3 style={{ margin: '0px 0px' }}>Medium of Booking Plot</h3>
				<ResponsiveBar
					margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
					data={recievedData}
					indexBy="medium"
					keys={[ 'Web', 'Mobile' ]}
					padding={0.3}
					colors={{ scheme: 'nivo' }}
					onClick={(data, event) => {
						this.handleOnclick(data);
					}}
					defs={[
						{
							id: 'dots',
							type: 'patternDots',
							background: 'inherit',
							color: '#38bcb2',
							size: 4,
							padding: 1,
							stagger: true
						},
						{
							id: 'lines',
							type: 'patternLines',
							background: 'inherit',
							color: '#eed312',
							rotation: -45,
							lineWidth: 6,
							spacing: 10
						}
					]}
					fill={[
						{
							match: {
								id: 'Web'
							},
							id: 'lines'
						},
						{
							match: {
								id: 'Mobile'
							},
							id: 'dots'
						}
					]}
					borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
					axisTop={null}
					axisRight={null}
					axisBottom={{
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
						legend: 'Medium of Booking',
						legendPosition: 'middle',
						legendOffset: 40
					}}
					axisLeft={{
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
						legend: 'Frequency',
						legendPosition: 'middle',
						legendOffset: -50
					}}
					labelSkipWidth={12}
					labelSkipHeight={12}
					labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
					legends={[
						{
							dataFrom: 'keys',
							anchor: 'bottom-right',
							direction: 'column',
							justify: false,
							translateX: 120,
							translateY: 0,
							itemsSpacing: 2,
							itemWidth: 100,
							itemHeight: 20,
							itemDirection: 'left-to-right',
							itemOpacity: 0.85,
							symbolSize: 20,
							effects: [
								{
									on: 'hover',
									style: {
										itemOpacity: 1
									}
								}
							]
						}
					]}
					animate={true}
					motionStiffness={90}
					motionDamping={15}
				/>
			</div>
		);
	}
}
