import DotEnv from 'dotenv'

DotEnv.config({
    path: './.env.local'
});

import { v2 as Cloudinary } from 'cloudinary';
import { supabase } from '../../lib/initSupabase';
import { knex } from '../../lib/initKnex';
import { Tau } from '../../lib/tau';

export async function handler (event) {
  const tau = new Tau({
    broadcasterId: 109561494
  });
  Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, 
    secure: true
  });
  const redemptions = await tau.ListChannelPointRedemptions();
  await Promise.all(await redemptions.data.map(async(redemption) => {
    const clipId = redemption.prompt.split(' by ')[0];
    const { data } = await tau.getClip(clipId);
    if (data) {
        await tau.DeleteChannelPointRedemption(redemption.id);
    }
  }));
  // Votes Up
  const votesUpQuery = knex.select('clip_id', knex.raw('count(*) as ??', ['vote_up']))
    .from('votes')
    .whereLike('vote', 'up')
    .groupBy('clip_id')
    .as('votes_up')
  // Votes Down
  const votesDownQuery = knex.select('clip_id', knex.raw('count(*) as ??', ['vote_down']))
    .from('votes')
    .whereLike('vote', 'down')
    .groupBy('clip_id')
    .as('votes_down')
  // Complete query
  const clips = await knex.select('*', 
    knex.raw('("votes_up"."vote_up"-"votes_down"."vote_down") as ??', ['sum_votes']),
    knex.raw('("votes_up"."vote_up"+"votes_down"."vote_down") AS ??', ['total_votes_cast'])
  )
    .from('clips')
    .leftJoin(votesUpQuery, 'clips.id', 'votes_up.clip_id')
    .leftJoin(votesDownQuery, 'clips.id', 'votes_down.clip_id')
    .where(knex.raw('("votes_up"."vote_up"-"votes_down"."vote_down") > 0'))
    .orderBy([
      { column: 'sum_votes', order: 'desc' },
      { column: 'total_votes_cast', order: 'desc' },
      { column: 'view_count', order: 'desc' }
    ])
    .limit(20)
  clips.forEach(async (clip) => {
    const clipId = `${clip.id} by ${clip.creator_name}`;
    const clipTitle = `${clip.title} by ${clip.creator_name}`;
    const clipUrl = String(clip.thumbnail_url).split('-preview')[0] + '.mp4'
    await new Promise((resolve, reject) => {
      Cloudinary.uploader.upload(clipUrl, {
        public_id: clip.id,
        folder: 'twitch-overlay/clips',
        resource_type: 'video',
      }, (error, result) => {
        if(error) reject(error);
        else resolve(result);
      })
    });
    console.log('Add ', clipTitle)
    await tau.CreateChannelPointRedemption(clipTitle, clipId, 2000);
  });
}