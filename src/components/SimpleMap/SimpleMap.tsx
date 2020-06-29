
import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import { ApiConfig } from '../../config/api.confing';

const SimpleMap = (props: any) => {
    const { classes } = props
    const [center] = useState({lat: 44.787197, lng: 20.457273 });
    const [zoom] = useState(11);
    //const image = "http://psce.pw/T8WRA"
    let colorOne = 'grey'
    let colorTwo = 'grey'
    if(props.availableOne === 1){
      colorOne = 'red'
    }
    if(props.availableTwo === 1){
      colorTwo = 'red'
    }
    return (
        <div style={{ height: '200px', width: '200px' }}>
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
            address="Deligradska 40, Beograd"
            image={ApiConfig.PHOTO_PATH + 'radnja1.jpg'}
            //anchor= {image}
          />

        <Marker
            lat={44.822705}
            lng={20.461270}
            name="Furniture Store 1"
            color = { colorTwo }
            address="Cara dušana 46, Beograd"
            image={ApiConfig.PHOTO_PATH + 'radnja2.jpg'}
          />
        </GoogleMapReact>
      </div>
    );
}

export default SimpleMap;