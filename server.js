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

// temp route to test to make sure you can access the table and contents inside it
app.get('/test', async (req, res) => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .limit(5)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})


app.get('/exercises', async (req, res) => {

    //this is an example of destructuring. destructuring is when you can extract values from an object based on its name. 
    const {level = [], equipment = [], primaryMuscles = [], category = []} = req.query;

    const levels = Array.isArray(level) ? level : [level]
    const equipments = Array.isArray(equipment) ? equipment : [equipment]
    const muscles = Array.isArray(primaryMuscles) ? primaryMuscles : [primaryMuscles]
    const categories = Array.isArray(category) ? category : [category]

   console.log('Get /exercises hit')
    
    let query = supabase.from('exercises').select('id, name, level, equipment, primaryMuscles, category')

    if (levels.length > 0) {
        query = query.in('level', levels)
    }

    const wantsBodyOnly = equipments.includes('Body Only');
    const wantsEquipmentReq = equipments.includes('Equipment Required');

    if (wantsBodyOnly && !wantsEquipmentReq) {
        query = query.eq('equipment', 'Body Only')
    }

    if (wantsEquipmentReq && !wantsBodyOnly) {
        query = query.neq('equipment', 'Body Only')
    }


    if (muscles.length > 0) {
        query = query.in('primaryMuscles', muscles)
    }

    if (categories.length > 0) {
        query = query.in('category', categories)
    }

    const {data, error} = await query
    if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: error.message})
    }
    
    // console.log(data)
    
    res.json(data)
})

//display the details base on its id
app.get('/exercises:id', async (req, res) => {

    const {id} = req.params;

    const {data, error} = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        //adding single here forces the exercise to only provide one id just in case there would be an additional id 
        .single()

    if (error) {
        console.error('Error fetching excercise:', error)
        return res.status(500).json({error: error.message})
    }

    res.json(data)
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})