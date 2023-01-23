# Timeline
<p align="center">
Timeline is a full-stack web application that allows user to organize their favorite Moments in Branches.</br>

  <img src="https://github.com/bytesbybianca/readme-assets/blob/main/project-images/timeline-1.png?raw=true" width="35%">
  <img src="https://github.com/bytesbybianca/readme-assets/blob/main/project-images/timeline-2.png?raw=true" width="35%">
</p>

**Link to project**: [https://timeline.up.railway.app/](https://timeline.up.railway.app/)

## How It's Made:

**Tech used:** EJS, CSS, Bootstrap, JavaScript, Node.js, Express, Mongoose, Passport, Cloudinary

Timeline was built out of a decade long wish to organize significant events in my life.
 - I used EJS, to dynamically display each Branch and Moment as the user creates them.
 - I used Mongoose to structure user inputs to easily access information.
 - I used Bootstrap and utilized components to easily achieve a clean look
 - I used Passport for authentication to allow each user to access their own account, decide which of their creations is public, and access other public creations.
 - I used Cloudinary to manage user uploaded media.
 - I used MVC to structure my code.


## Optimizations
#### Future
- Build the perfect Timeline style
- Embed exisiting social media posts in Moments
- Add a star/favorite Moment feature for highlighted display

Find more on the [Issues](https://github.com/bytesbybianca/timeline/issues) page.

## Lessons Learned:
I learned so much over the course of building this app:
- Figuring out where to put logic: Should it go in EJS? Controller? An entirely separate JS file? I played around with placing my logic in different places. And as I learned more about what worked best, I figured out where it is best placed.
- Styling made easy: I'd once spent hours coding modals and tooltips for another project. I was able to focus on back-end work with time saved using Bootstrap.
- Testing for all: I've realized there's so much to be discovered in testing not only on my normal test account, but new and existing accounts with varying states of app use. After figuring this out, I'd set up a routine testing with different accounts.
