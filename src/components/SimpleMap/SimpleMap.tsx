
import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

const SimpleMap = (props: any) => {
    const { classes } = props
    const [center] = useState({lat: 44.7866, lng: 20.4489 });
    const [zoom] = useState(11);
    //const image = "http://psce.pw/T8WRA"
    let colorOne='red'; 
    let colorTwo='grey';
    return (
        <div style={{ height: '200px', width: '200px' }}>
        <h1>{props.status}</h1>
        <GoogleMapReact
          bootstrapURLKeys={{ key: '' }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <Marker
            lat={44.790189}
            lng={20.459513}
            name="Furniture Store 2"
            color = { colorOne }
            address="Gornjačka 94-116, Beograd"
            //anchor= {image}
          />

        <Marker
            lat={44.796661}
            lng={20.460186}
            name="Furniture Store 1"
            color = { colorTwo }
            address="Deligradska 40, Beograd"
          />
        </GoogleMapReact>
      </div>
    );
}

export default SimpleMap;