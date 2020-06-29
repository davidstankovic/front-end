import React from 'react';
import './Marker.css';

const Marker = (map: any) => {
    const {color, address, name, image} = map;

    return (
      <div>
      <div className="marker"
        style={{ backgroundColor: color, cursor: 'pointer'}}
        title={name + '\n' + address}/>
      <div>
        <img height="30px" width="30px" src={image}/>
      </div>
      </div>
    );
  };

  export default Marker;