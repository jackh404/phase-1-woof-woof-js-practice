const doggos = []
const dogBar = document.getElementById('dog-bar')
const dogBtn = document.getElementById('toggleGood')
const filterBtn = document.getElementById('good-dog-filter')
let activeDog
let filtered = false

//tells server to make a dog good or bad
dogBtn.addEventListener("click", e => {
    doggos.find(dog => activeDog)
    activeDog.isGoodDog = !activeDog.isGoodDog
    fetch(`http://localhost:3000/pups/${activeDog.id}`,{
        method: "PATCH",
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            'isGoodDog' : activeDog.isGoodDog
        })
    })
    .then(()=>{
        display(activeDog)
        if(filtered)
            renderDoggos()
    })
})

//filters dogs by goodness
filterBtn.addEventListener('click', e =>{
    filtered = !filtered
    renderDoggos()
    console.log('filter clicked')
    if(filtered)
        filterBtn.innerText = "Filter good dogs: ON"
    else
        filterBtn.innerText = "Filter good dogs: OFF"
})

//puts all dog's names in spans in the list at the top of the window
const renderDoggos = () => {
    dogBar.textContent = ""
    let myDogs
    if(filtered){
        myDogs = doggos.filter(dog => dog.isGoodDog)
    } else {
        myDogs = doggos
    }
    myDogs.forEach((doggo)=>{
        const dogSpan = document.createElement('span')
        dogSpan.textContent = doggo.name
        dogSpan.addEventListener('click',(e)=>display(doggo))
        dogBar.append(dogSpan)
    })
}

//shows a single dog in the dog pane
const display = (doggo) => {
    activeDog = doggo
    dogBtn.classList.remove('hidden')
    if(doggo.isGoodDog){
        dogBtn.innerText = 'Good Dog'
    } else {
        dogBtn.innerText = 'Bad Dog'
    }

    const dogImage = document.getElementById('dogImage')
    dogImage.src = doggo.image
    dogImage.alt = `Photo of ${doggo.name}`

    document.getElementById('dogName').textContent = doggo.name
}

//fetches the dogs and runs renderDoggos
fetch('http://localhost:3000/pups')
.then(resp => resp.json())
.then(data => {
    doggos.splice(0,0,...data)
    renderDoggos()
})