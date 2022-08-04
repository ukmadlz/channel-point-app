import React, { useState } from 'react';
import { Auth } from '@supabase/ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowUp, faCircleArrowDown } from '@fortawesome/free-solid-svg-icons'

const fetcher = async (url, method, token, body) =>{
  console.log({ token })
  const result = await fetch(url, {
    method,
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body: JSON.stringify(body)
  })
  return result.json();
}

export default function VoteComponent ({ id }) {
  const { session } = Auth.useUser()
  const [currentVote, setCurrentVote] = useState('');
  const changeVote = async (clipId, selectedVote) => {
    console.log({
      clipId,
      selectedVote
    })
    await fetcher('/api/postVote', 'POST', session.access_token, {
      clipId,
      vote: selectedVote,
    })
    setCurrentVote(selectedVote)
  }
  const selectedStyle = (voteType, currentVote) => {
    return {
      color: (currentVote == voteType) ? 'green' : 'red',
      margin: "0.5em",
      fontSize: "2.5em",
    }
  }
  return(<div>
    <a
      onClick={() => {changeVote(id, 'up')}}
      style={selectedStyle('up', currentVote)}
    >
      <FontAwesomeIcon icon={faCircleArrowUp} />
    </a>
    <a
      onClick={() => {changeVote(id, 'down')}}
      style={selectedStyle('down', currentVote)}
      >
      <FontAwesomeIcon icon={faCircleArrowDown} />
    </a>
  </div>)
}