import { useRef, useEffect, useState } from "react";
import * as pmtiles from "pmtiles";
import layers from "protomaps-themes-base";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
//import './map.css';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(-87.63142947838614);
  const [lat] = useState(41.882913703166246);
  const [zoom] = useState(11);

  let protocol = new pmtiles.Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);

  useEffect(() => {
    if (map.current) return; //stops map from intializing more than once
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        id: "43f36e14-e3f5-43c1-84c0-50a9c80dc5c7",
        name: "MapLibre",
        zoom: 0,
        pitch: 0,
        center: [41.884579601743276, -87.6279871036212],
        glyphs:
          "https://cdn.jsdelivr.net/gh/piemadd/fonts@54b954f510dc79e04ae47068c5c1f2ee39a69216/_output/{fontstack}/{range}.pbf",
        layers: layers("protomaps","light"),
        bearing: 0,
        sources: {
          protomaps: {
            type: "vector",
            tiles: [
              "https://tilea.piemadd.com/tiles/{z}/{x}/{y}.mvt",
              "https://tileb.piemadd.com/tiles/{z}/{x}/{y}.mvt",
              "https://tilec.piemadd.com/tiles/{z}/{x}/{y}.mvt",
              "https://tiled.piemadd.com/tiles/{z}/{x}/{y}.mvt",
              //"http://10.0.0.237:8081/basemap/{z}/{x}/{y}.mvt"
            ],
            maxzoom: 13,
          },
        },
        version: 8,
        metadata: {},
      },
      center: [lng, lat],
      zoom: zoom,
    });
  });

  return (
    <div ref={mapContainer} className='map' />
  );
};

export default Map;
