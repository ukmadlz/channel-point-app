import DotEnv from 'dotenv'
import { Tau } from '../../lib/tau';
import { supabase } from '../../lib/initSupabase';

DotEnv.config({
    path: './.env.local'
});

export async function handler (event) {
  console.log(`Get all clips from Twitch`);

  const tau = new Tau({
    broadcasterId: 109561494
  });

  let clips = [];
  let cursor = ""
  
  do {
    const { data, pagination } = await tau.listClips(cursor);  
    if(data && data.length) {
      clips = [...clips, ...data];
    }
    if(pagination.cursor) {
      cursor = pagination.cursor
    } else {
      break;
    }
  } while(true)

  console.debug('Attempt to upsert to PG')
  clips.forEach(async (clip) => {
    const { id, broadcaster_id, broadcaster_name, creator_id, creator_name, title, view_count, created_at, thumbnail_url, duration } = clip
    const { error } = await supabase
      .from('clips')
      .upsert({ id, broadcaster_id, broadcaster_name, creator_id, creator_name, title, view_count, twitch_created_at: created_at, thumbnail_url, duration })
    if(error) {
      console.error(error)
    }
  })
};