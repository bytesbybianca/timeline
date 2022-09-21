const newTimelineBtn = document.querySelector('#newTimelineBtn')
const newTimelineDiv = document.querySelector('#newTimeline')
const timelineInfoBtn = document.querySelector('#timelineInfoBtn')
const timelineInfoDiv = document.querySelector('#timelineInfo')

newTimelineBtn.addEventListener('click', () => {
    newTimelineDiv.classList.toggle('hidden')
})
timelineInfoBtn.addEventListener('click', () => {
    timelineInfoDiv.classList.toggle('hidden')
})