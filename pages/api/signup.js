import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  const { error } = await supabase
    .from('waitlist')
    .insert([{ email, signed_up_at: new Date().toISOString() }])

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Already on the list' })
    }
    return res.status(500).json({ error: 'Something went wrong' })
  }

  return res.status(200).json({ success: true })
}
