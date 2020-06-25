import React from 'react';
import './Marker.css';

const Marker = (map: any) => {
    const {color, address, name, image} = map;
    
    return (
      <div className="marker"
        style={{ backgroundColor: color, cursor: 'pointer'}}
        title={name + '\n' + address}
      />
    );
  };

  export default Marker;