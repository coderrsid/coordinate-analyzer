import React, { useState, useRef, useEffect } from 'react';
import './MarkerMap.css';
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import MarkerLogo from '../../assets/marker.svg';

const MarkerMap = (props) => {
	const data = props.mapData;
	const mapRef = useRef();
	let mapData = data ? data.slice(0, 500) : [];

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

	const [ viewport, setViewport ] = useState({
		latitude: parseFloat(data[0].latitude),
		longitude: parseFloat(data[0].longitude),
		width: '100%',
		height: '100%',
		zoom: 6
	});

	const [ selectedLoc, setSelectedLoc ] = useState(null);

	const points = mapData.map((data) => ({
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
		options: { radius: 75, maxZoom: 17 }
	});
	return (
		<div className="mapContainer">
			<ReactMapGL
				{...viewport}
				maxZoom={17}
				mapboxApiAccessToken={
					'pk.eyJ1IjoiY29kZXJyc2lkIiwiYSI6ImNrOWlyZHBmYzBibm8za3FsdG56ajE5c2QifQ.ho5n63DYciCXvzfzTD6qbA'
				}
				mapStyle="mapbox://styles/coderrsid/ck9jqy9i10v2c1jrrwikzkji0"
				onViewportChange={(newViewport) => {
					setViewport({ ...newViewport });
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
										width: `${10 + pointCount / points.length * 40}px`,
										height: `${10 + pointCount / points.length * 40}px`
									}}
									onClick={() => {
										const expansionZoom = Math.min(
											supercluster.getClusterExpansionZoom(cluster.id),
											20
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

					if (isCluster && viewport.zoom >= 15) {
						const points = isCluster ? supercluster.getLeaves(cluster.id, Infinity) : null;
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
												console.log(point);
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
									console.log(cluster);
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
		</div>
	);
};

export default MarkerMap;
