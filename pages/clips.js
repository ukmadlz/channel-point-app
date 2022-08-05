import Link from 'next/link'
import { Card, Typography, Space } from '@supabase/ui'
import { supabase } from '../lib/initSupabase'
import HeadComponent from '../components/head.component.mjs'
import TwitchPreviewComponent from '../components/twitch-preview.component.mjs'
import VoteComponent from '../components/vote.component.mjs'

export default function Profile({ clips }) {
  return (
    <div>
      <HeadComponent/>
    <main style={{ maxWidth: '720px', margin: '96px auto' }}>
      {clips.map(clip => {
        return (
          <Card
            key={clip.id + '-selector'}
            hoverable
            title={clip.title + ' by ' + clip.creator_name}
            cover={[
              <TwitchPreviewComponent id={clip.id} thumbnail_url={clip.thumbnail_url} />,
            ]}
          >
            <VoteComponent id={clip.id}/>
          </Card>
        )
      })}
    </main>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    // If no user, redirect to index.
    return { props: {}, redirect: { destination: '/', permanent: false } }
  }

  const { data, error } = await supabase
    .from('clips')
    .select()
    .order('twitch_created_at', { ascending: false })

  // If there is a user, return it.
  return { props: { clips: data } }
}
