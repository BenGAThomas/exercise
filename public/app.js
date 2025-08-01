//Configure the form to fetch the data and display results as HTML

document.getElementById('filterForm').addEventListener('submit', async e => {
    e.preventDefault()

    const form = e.target

    const params = new URLSearchParams()
    //using urlsearchparams will allow us to add the values and the keys to the url
    
    new FormData(form).forEach((value, key) => {
        params.append(key, value)
        //using for each and append this way will allow us to see the filters for each category with the use of & in the console. i.e.: level=intermediate&primaryMuscles=Biceps&category=Strength&category=Stretching
    })

        //console.log(params.toString())

    try {
        const res = await fetch('/exercises?' + params.toString())
        //console.log('/exercises?' + params.toString())
        if(!res.ok) throw new Error(`HTTP ${res.status}`)
        const exercises = await res.json() //this will format the response as JSON
        
        //list elements inside existing ul tag
        const ul = document.getElementById('results')
        if(exercises.length === 0) {
            ul.innerHTML = '<li>No exercises found.</li>'
        } else {
            ul.innerHTML = exercises.map(exercise => {
                return `
                <li>
                <a href="exercise.html?id=${encodeURIComponent(exercise.id)}" target="_blank"> 
                <strong>${exercise.name}</strong><br/>
                </a>
                Level: ${exercise.level},
                Equipment: ${exercise.equipment || 'None'},
                Primary Muscle: ${exercise.primaryMuscles || 'Unknown'},
                Category: ${exercise.category}
                

                </li>`
            }).join('')
        }

        //console.log(exercises.level)
    }
    catch (err) {
        console.log('Error fetching exercises:', err)
        document.getElementById('results').innerHTML = '<li>The exercises decided to be lazy on the couch.</li>'
    }
}

)



