//listing an anonymous function like this immediately calls it on page laod also called IIFE: Immediately invoked Function Expression

(async() => {
    //gets the encoded ID value from the link
    const params = new URLSearchParams(window.location.search)

    const id = params.get('id')

    const container = document.getElementById('details')

    if(!id) {
        container.textContent = 'No exercise specified'
        return
    }

    try {
        const res = await fetch(`/exercises/${encodeURIComponent(id)}`)
        if(!res.ok) throw new Error(`HTTP ${res.status}`)
            const ex = await res.json()

        const secondary = ex.secondaryMuscles ? ex.secondaryMuscles.split('|').join(', ') : ""

        const steps = ex.instructions ? ex.instructions.split('|') : []

        const baseIMG = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'
        const img0 = ex.imgage0 ? `<img src="${baseIMG}${ex.image0}" alt="${ex.name} image 1" style="max-width:300px; margin-right: 1 rem;">` : ''
        const img1 = ex.imgage1 ? `<img src="${baseIMG}${ex.image1}" alt="${ex.name} image 2" style="max-width:300px;">` : ''

        //List of other details
        container.innerHTML = `
            <h1>${ex.name}</h1>
            <p><strong>Force:</strong> ${ex.force}</p>
            <p><strong>Level:</strong> ${ex.level}</p>
            <p><strong>Mechanic:</strong> ${ex.mechanic}</p>
            <p><strong>Equipment:</strong> ${ex.equipment}</p>
            <p><strong>Primary Muscles:</strong> ${ex.primaryMuscles}</p>
            <p><strong>Secondary Muscles:</strong> ${ex.secondary}</p>
            <p><strong>Category:</strong> ${ex.category}</p>
        

            <h2>Instructions</h2>
            <ol>
                ${steps.map(step => `<li>${step}</li>`).join('')}
            </ol>

            <div>
                ${img0}${img1}
            </div>
        `
    } catch {
        console.error(err)
        container.textContent = 'Failed at running on the treadmill.'
    }

})()