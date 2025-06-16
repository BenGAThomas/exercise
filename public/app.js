//Configure the form to fetch the data and display results as HTML

document.getElementById('filterForm').addEventListener('submit', async e => {
    e.preventDefault()

    try {
        const res = await fetch('/excersises')
        if(!res.ok) throw new Error(`HTTP ${res.status}`)
        const excersices = await res.json()
        console.log(excersices)
    }
    catch (err) {
        console.log('Error fetching exercises:', err)
    }
}

)