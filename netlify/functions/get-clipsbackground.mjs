import DotEnv from 'dotenv'
import { v2 as Cloudinary } from 'cloudinary';

DotEnv.config({
    path: './.env.local'
});

import { Tau } from '../../lib/tau';
import { supabase } from '../../lib/initSupabase';

export async function handler (event) {
  Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, 
    secure: true
  });

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
      .upsert({
        id,
        broadcaster_id,
        broadcaster_name,
        creator_id,
        creator_name,
        title,
        view_count,
        twitch_created_at: created_at,
        thumbnail_url,
        duration,
        updated_at: new Date()
      })
    if(error) {
      console.error(error)
    }
    const clipUrl = String(clip.thumbnail_url).split('-preview')[0] + '.mp4'
    await new Promise((resolve, reject) => Cloudinary.uploader.upload(clipUrl, {
      public_id: clip.id,
      folder: 'twitch-overlay/clips',
      resource_type: 'video',
    }, (error, result) => {
      if(error) resolve(error);
      else reject(result);
    }))
  })
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Get from Twitch" }),
  };
};