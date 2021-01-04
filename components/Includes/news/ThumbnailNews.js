import React, { useEffect, useState } from 'react'
import Img from 'react-image';

const ThumbnailNews = (props) => {
  return(
    <>
      <Img
        alt={'null'} 
        unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
        loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
        src={['/static/placeholders/placeholder_landscape.png', '/static/placeholders/placeholder_landscape.png']} />
    </>
  )
}

export default ThumbnailNews;