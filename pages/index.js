import Link from 'next/link'
import useSWR from 'swr'
import { Auth, Card, Typography, Space, Button, Icon } from '@supabase/ui'
import { supabase } from '../lib/initSupabase'
import { useEffect, useState } from 'react'
import HeadComponent from '../components/head.component.mjs'

const fetcher = (url, token) =>
  fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
  }).then((res) => res.json())

const Index = () => {
  const { user, session } = Auth.useUser()
  const { data, error } = useSWR(
    session ? ['/api/getUser', session.access_token] : null,
    fetcher
  )
  const [authView, setAuthView] = useState('sign_in')

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') setAuthView('update_password')
        if (event === 'USER_UPDATED')
          setTimeout(() => setAuthView('sign_in'), 1000)
        // Send session to /api/auth route to set the auth cookie.
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
        fetch('/api/auth', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin',
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json())
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  const View = () => {
    if (!user)
      return (
        <Space direction="vertical" size={8}>
          <div>
            <Typography.Title level={3}>
              Welcome to Clips as Channel Point Redemptions
            </Typography.Title>
          </div>
          <Auth
            onlyThirdPartyProviders={true}
            supabaseClient={supabase}
            providers={['twitch']}
            view={authView}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </Space>
      )

    return (
      <Space direction="vertical" size={6}>
        {authView === 'update_password' && (
          <Auth.UpdatePassword supabaseClient={supabase} />
        )}
        {user && (
          <>
            <Typography.Text>You're signed in</Typography.Text>
            <Typography.Text strong>Email: {user.email}</Typography.Text>

            <Button
              icon={<Icon type="LogOut" />}
              type="outline"
              onClick={() => supabase.auth.signOut()}
            >
              Log out
            </Button>

            <Typography.Text>
              <Link href="/clips">
                <a>Review and vote for the clips to be in the channel point redemptions</a>
              </Link>
            </Typography.Text>
          </>
        )}
      </Space>
    )
  }

  return (
    <div>
      <HeadComponent/>
      <main style={{ maxWidth: '420px', margin: '96px auto' }}>
      <Card>
        <View />
      </Card>
      </main>
    </div>
  )
}

export default Index
