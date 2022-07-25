import Link from 'next/link'
import { Card, Typography, Space } from '@supabase/ui'
import { supabase } from '../lib/initSupabase'
import HeadComponent from '../components/head.component.mjs'

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
            title={clip.title}
            // cover={[
            //   <img
            //     src={clip.thumbnail_url}
            //   />,
            // ]}
          >
            <iframe src={`https://clips.twitch.tv/embed?clip=${clip.id}&parent=localhost`} frameBorder="0" allowFullScreen={true} scrolling="no" height="378" width="620"></iframe>
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

  // If there is a user, return it.
  return { props: { clips: data } }
}
