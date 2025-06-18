import express from 'express';
import dotenv from 'dotenv';
import {createClient} from '@supabase/supabase-js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

app.use(express.static('public'))

app.get('/exercises', async (req, res) => {

    //this is an example of destructuring. destructuring is when you can extract values from an object based on its name. 
    const {level = [], equipment = [], primaryMuscles = [], category = []} = req.info;

    const levels = Array.isArray(level) ? level : [level]
    const equipments = Array.isArray(equipment) ? equipment : [equipment]
    const muscles = Array.isArray(primaryMuscles) ? primaryMuscles : [primaryMuscles]
    const categories = Array.isArray(category) ? category : [category]

    //console.log('Get /excersises hit')
    
    let info = supabase.from('exercises').select('id, name, level, equipment, primaryMuscles, category')

    if (levels.length > 0 && levels.length < 3) {
        info = info.in('level', levels)
    }

    const wantsBodyOnly = equipments.includes('Body Only');
    const wantsEquipmentReq = equipments.includes('Equipment Required');

    if (wantsBodyOnly && !wantsEquipmentReq) {
        info = info.eq('equipment', 'Body Only')
    }

    if (wantsEquipmentReq && !wantsBodyOnly) {
        info = info.neq('equipment', 'Body Only')
    }


    if (muscles.length > 0 && muscles.length < 17) {
        info = info.in('primaryMuscles', muscles)
    }

    if (categories.length > 0 && categories.length < 7) {
        info = info.in('category', categories)
    }

    const {data, error} = await info
    if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: error.message})
    }
    
    console.log(data)
    
    res.json(data)
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})