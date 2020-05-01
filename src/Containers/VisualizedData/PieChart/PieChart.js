import React, { Component } from 'react';
import { ResponsivePie } from '@nivo/pie';
import './PieChart.css';

export default class PieChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			p2p: false,
			hourly: false,
			long: false
		};
	}

	calculateTrip = (data) => {
		let longDist = 0,
			p2p = 0,
			hourRent = 0;
		for (let i = 0; i < data.length; i++) {
			let category = data[i].category;

			if (category === 'Long Distance') {
				++longDist;
			} else if (category === 'Point to Point') {
				++p2p;
			} else if (category === 'Hourly Rental') {
				++hourRent;
			}
		}
		const tripCategory = [
			{
				id: 'Long Distance',
				label: 'Long Distance',
				value: longDist
			},
			{
				id: 'Point to Point',
				label: 'Point to Point',
				value: p2p
			},
			{
				id: 'Hourly Rental',
				label: 'Hourly Rental',
				value: hourRent
			}
		];

		return tripCategory;
	};

	handleOnclick = (e) => {
		let category = e['id'];

		if (category === 'Long Distance') {
			this.setState({ long: !this.state.long });
		} else if (category === 'Point to Point') {
			this.setState({ p2p: !this.state.p2p });
		} else if (category === 'Hourly Rental') {
			this.setState({ hourly: !this.state.hourly });
		}
		this.props.mapCategoryChange(this.state);
	};

	render() {
		let data = this.calculateTrip(this.props.tripCategory);

		return (
			<div className="pieContainer">
				<h3 style={{ margin: '0px 0px' }}>Trip Category Plot</h3>
				<ResponsivePie
					data={data}
					margin={{ top: 0, right: 80, bottom: 0, left: 80 }}
					innerRadius={0.5}
					padAngle={0.7}
					cornerRadius={3}
					colors={{ scheme: 'nivo' }}
					onClick={(data, event) => {
						this.handleOnclick(data);
					}}
					borderWidth={1}
					borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
					radialLabelsSkipAngle={10}
					radialLabelsTextXOffset={6}
					radialLabelsTextColor="#333333"
					radialLabelsLinkOffset={0}
					radialLabelsLinkDiagonalLength={16}
					radialLabelsLinkHorizontalLength={24}
					radialLabelsLinkStrokeWidth={1}
					radialLabelsLinkColor={{ from: 'color' }}
					slicesLabelsSkipAngle={10}
					slicesLabelsTextColor="#333333"
					animate={true}
					motionStiffness={90}
					motionDamping={15}
					defs={[
						{
							id: 'dots',
							type: 'patternDots',
							background: 'inherit',
							color: 'rgba(255, 255, 255, 0.3)',
							size: 4,
							padding: 1,
							stagger: true
						},
						{
							id: 'lines',
							type: 'patternLines',
							background: 'inherit',
							color: 'rgba(255, 255, 255, 0.3)',
							rotation: -45,
							lineWidth: 6,
							spacing: 10
						}
					]}
					fill={[
						{
							match: {
								id: 'Long Distance'
							},
							id: 'lines'
						},
						{
							match: {
								id: 'Point to Point'
							},
							id: 'dots'
						}
					]}
					legends={[
						{
							anchor: 'bottom',
							direction: 'row',
							translateY: 56,
							itemWidth: 100,
							itemHeight: 18,
							itemTextColor: '#999',
							symbolSize: 18,
							symbolShape: 'circle',
							effects: [
								{
									on: 'hover',
									style: {
										itemTextColor: '#000'
									}
								}
							]
						}
					]}
				/>
			</div>
		);
	}
}
