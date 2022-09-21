const photoFieldContainer = document.querySelector('.momentImageContainer')
const photoField = document.querySelector('#momentImage')
const locationFieldContainer = document.querySelector('.locationContainer')
const locationField = document.querySelector('#location')
const twitterFieldContainer = document.querySelector('.tweetIdContainer')
const twitterField = document.querySelector('#tweetId')
const journalFieldContainer = document.querySelector('.journalContainer')
const journalField = document.querySelector('#journalEntry')

document.querySelector('#momentType').addEventListener('change', selectedType => {
    let currentType = selectedType.target.value
    if(currentType === 'photo') {
        photoFieldContainer.classList.remove('hidden')
        photoField.required = true
        locationFieldContainer.classList.add('hidden')
        locationField.required = false
        twitterFieldContainer.classList.add('hidden')
        twitterField.required = false
        journalFieldContainer.classList.add('hidden')
        journalField.required = false
        console.log('photo shown')
    } else if(currentType === 'journal') {
        photoFieldContainer.classList.add('hidden')
        photoField.required = false
        locationFieldContainer.classList.add('hidden')
        locationField.required = false
        twitterFieldContainer.classList.add('hidden')
        twitterField.required = false
        journalFieldContainer.classList.remove('hidden')
        journalField.required = false
        console.log('journal shown')
    } else if(currentType === 'location') {
        photoFieldContainer.classList.add('hidden')
        photoField.required = false
        locationFieldContainer.classList.remove('hidden')
        locationField.required = true
        twitterFieldContainer.classList.add('hidden')
        twitterField.required = false
        journalFieldContainer.classList.add('hidden')
        journalField.required = false
        console.log('location shown')
    } else if(currentType === 'twitter') {
        photoFieldContainer.classList.add('hidden')
        photoField.required = false
        locationFieldContainer.classList.add('hidden')
        locationField.required = false
        twitterFieldContainer.classList.remove('hidden')
        twitterField.required = true
        journalFieldContainer.classList.add('hidden')
        journalField.required = false
        console.log('twitter shown')
    }
})

console.log(locationField.value.length)