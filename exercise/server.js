import express from 'express';
import dotenv from 'dotenv';
import {createClient} from '@supabase/supabase-js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

app.use(express.static('public'))

app.get('/exercises', async (req, res) => {
    
    let info = supabase.from('exercises')
    .select('name')

    const {data, error} = await info
    if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: error.message})
    }
    
    console.log(data)
    
    res.json(data)
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})