import { supabase } from '../../lib/initSupabase'

// Setting a users vote on a specific clip
export default async (req, res) => {
  const token = req.headers.token

  // Check if user is logged-in
  let { data: user, error } = await supabase.auth.api.getUser(token)
  if (error) return res.status(401).json({ error: error.message })
  
  // Extract the vote components
  const { clipId, vote } = req.body;
  const userId = user.user_metadata.provider_id
  try{
    const voteObj = {clip_id: clipId, user_id: userId, vote, updated_at: new Date() };
    const findResult = await supabase
      .from('votes')
      .select('id')
      .eq('clip_id', clipId)
      .eq('user_id', userId)
      .limit(1)
      .single()
    if(!findResult.data) {
      console.log('New Vote')
      const insertResult = await supabase
        .from('votes')
        .insert([
          voteObj
        ])
      return res.status(200).json({
        data: insertResult.data
      })
    } else {
      voteObj.id = findResult.data.id;
      const upsertData = await supabase
        .from('votes')
        .upsert([
          voteObj
        ])
      return res.status(200).json({
        data: upsertData.data
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}