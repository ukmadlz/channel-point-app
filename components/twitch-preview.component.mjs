import React, { useState } from 'react';

export default function TwitchPreviewComponent (props) {
  const [preview, setPreview] = useState(false);
  const image = (<img
    style={{
      width: "100%",
      cursor: "pointer"
    }}
    src={props.thumbnail_url}
  />);
  const iframe = (<iframe
      src={`https://clips.twitch.tv/embed?clip=${props.id}&parent=localhost`}
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