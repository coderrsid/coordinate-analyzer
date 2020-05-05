import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './MarkerMap.css';
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import MarkerLogo from '../../assets/marker.svg';

const MarkerMap = (props) => {
	const data = props.mapData.slice(0, 2000);
	const mapRef = useRef();
	let [ mapData, handleData ] = useState([]);
	let [ mediumFilter, handleMediumFilter ] = useState();
	let [ categoryFilter, handleCategoryFilter ] = useState();
	let [ clearFilters, handleClearFilters ] = useState(false);
	const onPropsChange = useCallback(
		() => {
			handleMediumFilter(props.mediumChange);
			handleCategoryFilter(props.categoryChange);
		},
		[props.mediumChange, props.categoryChange],
	)

	useMemo(
		() => {
			let filteredData = [];
			if(categoryFilter) {
				filteredData =
					categoryFilter === 'Point to Point'
						? data.filter((data) => {
								return data.category === 'Point to Point';
							})
						: categoryFilter === 'Hourly Rental'
							? data.filter((data) => {
									return data.category === 'Hourly Rental';
								})
							: categoryFilter === 'Long Distance'
								? data.filter((data) => {
										return data.category === 'Long Distance';
									})
								: data;
				if(mediumFilter) {
					filteredData =
					mediumFilter === 'Web'
						? filteredData.filter((data) => {
								return data.web === '1';
							})
						: mediumFilter === 'Mobile'
							? filteredData.filter((data) => {
									return data.mobile === '1';
								})
							: filteredData;
				}
			} else if(mediumFilter) {
					filteredData =
					mediumFilter === 'Web'
						? data.filter((data) => {
								return data.web === '1';
							})
						: mediumFilter === 'Mobile'
							? data.filter((data) => {
									return data.mobile === '1';
								})
							: data;
			} else {
				filteredData = data;
			}

			console.log(categoryFilter, mediumFilter, filteredData);
			handleData(filteredData);
		},
		[ categoryFilter, mediumFilter]
	);

	useMemo(
		() => {
			if (clearFilters) {
				handleMediumFilter("");
				handleCategoryFilter("");
				handleClearFilters(!clearFilters);
			}
		},
		[ clearFilters ]
	);

	useMemo(
		() => {
			console.log('marked map props changed');
			handleMediumFilter(props.mediumChange);
			handleCategoryFilter(props.categoryChange);
		}
	, [props.mediumChange, props.categoryChange])

	useEffect(() => {
		const listener = (e) => {
			if (e.key === 'Escape') {
				setSelectedLoc(null);
			}
		};
		window.addEventListener('keydown', listener);
		return () => {
			window.removeEventListener('keydown', listener);
		};
	});

	useEffect(() => {
		// mediumFilterChange(props.mediumChange);
		// categoryFilterChange(props.categoryChange);
	});

	const [ viewport, setViewport ] = useState({
		latitude: parseFloat(data[0].latitude),
		longitude: parseFloat(data[0].longitude),
		width: '100%',
		height: '80%',
		zoom: 10
	});

	const [ selectedLoc, setSelectedLoc ] = useState(null);

	const points = mapData ? mapData.map((data) => ({
		type: 'Feature',
		properties: { cluster: false, dataId: data.id, category: data.category },
		geometry: {
			type: 'Point',
			coordinates: [ parseFloat(data.longitude), parseFloat(data.latitude) ]
		}
	})) : data.map((data) => ({
		type: 'Feature',
		properties: { cluster: false, dataId: data.id, category: data.category },
		geometry: {
			type: 'Point',
			coordinates: [ parseFloat(data.longitude), parseFloat(data.latitude) ]
		}
	}));

	const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

	const { clusters, supercluster } = useSupercluster({
		points,
		bounds,
		zoom: viewport.zoom,
		options: { radius: 75, maxZoom: 18 }
	});
	return (
		<div className="mapContainer">
			<ReactMapGL
				className="map"
				{...viewport}
				maxZoom={18}
				mapboxApiAccessToken={
					'pk.eyJ1IjoiY29kZXJyc2lkIiwiYSI6ImNrOWlyZHBmYzBibm8za3FsdG56ajE5c2QifQ.ho5n63DYciCXvzfzTD6qbA'
				}
				mapStyle="mapbox://styles/coderrsid/ck9jqy9i10v2c1jrrwikzkji0"
				onViewportChange={(viewport) => {
					setViewport(viewport);
				}}
				ref={mapRef}
			>
				{clusters.map((cluster) => {
					const [ longitude, latitude ] = cluster.geometry.coordinates;
					const { cluster: isCluster, point_count: pointCount } = cluster.properties;

					if (isCluster && viewport.zoom < 15) {
						return (
							<Marker key={`cluster-${cluster.id}`} latitude={latitude} longitude={longitude}>
								<div
									className="cluster-marker"
									style={{
										width: `${10 + pointCount / points.length * 20}px`,
										height: `${10 + pointCount / points.length * 20}px`
									}}
									onClick={() => {
										const expansionZoom = Math.min(
											supercluster.getClusterExpansionZoom(cluster.id),
											25
										);

										setViewport({
											...viewport,
											latitude,
											longitude,
											zoom: expansionZoom,
											transitionInterpolator: new FlyToInterpolator({
												speed: 2
											}),
											transitionDuration: 'auto'
										});
									}}
								>
									{pointCount}
								</div>
							</Marker>
						);
					}

					if (viewport.zoom >= 15) {
						const points = isCluster ? supercluster.getLeaves(cluster.id) : null;
						if (points) {
							points.map((point) => {
								return (
									<Marker
										key={`data-${point.properties.dataId}`}
										latitude={point.geometry.coordinates[1]}
										longitude={point.geometry.coordinates[0]}
									>
										<button
											className="marker-btn"
											onClick={(e) => {
												e.preventDefault();
												setSelectedLoc(point);
											}}
										>
											<img src={MarkerLogo} alt="marked" />
										</button>
									</Marker>
								);
							});
						}
					}

					return (
						<Marker key={`data-${cluster.properties.dataId}`} latitude={latitude} longitude={longitude}>
							<button
								className="marker-btn"
								onClick={(e) => {
									e.preventDefault();
									setSelectedLoc(cluster);
								}}
							>
								<img src={MarkerLogo} alt="marked" />
							</button>
						</Marker>
					);
				})}
				{selectedLoc ? (
					<Popup
						latitude={selectedLoc.geometry.coordinates[1]}
						longitude={selectedLoc.geometry.coordinates[0]}
						onClose={() => {
							setSelectedLoc(null);
						}}
					>
						<div>
							<h2>ID : {selectedLoc.properties.dataId}</h2>
							<p>Category : {selectedLoc.properties.category}</p>
						</div>
					</Popup>
				) : null}
			</ReactMapGL>
			<div className="filtersContainer">
				<div className="bg-image" />
				<h2>Filter Data</h2>
				<div className="filter">
					<h3>Medium</h3>
					<select onChange={(e) => handleMediumFilter(e.target.value)} value={mediumFilter}>
						<option value="">Select Medium</option>
						<option value="Web">Web</option>
						<option value="Mobile">Mobile</option>
					</select>
				</div>
				<div className="filter">
					<h3>Travel Category</h3>
					<select onChange={(e) => handleCategoryFilter(e.target.value)} value={categoryFilter}>
						<option value="">Select Category</option>
						<option value="Point to Point">Point to Point</option>
						<option value="Hourly Rental">Hourly Rental</option>
						<option value="Long Distance">Long Distance</option>
					</select>
				</div>
				<div>
					<button onClick={() => handleClearFilters(!clearFilters)}>
						<span>Clear all filters</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default MarkerMap;
