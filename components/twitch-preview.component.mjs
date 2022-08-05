import React, { useState } from 'react';

export default function TwitchPreviewComponent ({ id, thumbnail_url }) {
  const [preview, setPreview] = useState(false);
  const image = (<img
    style={{
      width: "100%",
      cursor: "pointer"
    }}
    src={thumbnail_url}
  />);
  const iframe = (<iframe
      src={`https://clips.twitch.tv/embed?clip=${id}&parent=${(process.env.NODE_ENV == 'development') ? 'localhost' : 'troll-selecta.elsmore.me'}`}
      frameBorder="0"
      allowFullScreen={true}
      scrolling="no"
      height="378"
      width="100%">
    </iframe>)

  return (
    <div onClick={() => {
        setPreview(true)
    }}>
      {!preview ? image : iframe}
    </div>
  )
}