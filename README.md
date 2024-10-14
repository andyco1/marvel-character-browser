# Marvel Character Browser

This is an **Angular** and **Ionic** web application that allows users to explore Marvel characters using the **Marvel Comics API**. The app is responsive and works across both mobile and desktop devices.

## Features
- Character List: Browse a list of Marvel characters fetched from the API, displaying their names and thumbnails.
- Character Search: Search for characters by name using the Marvel API’s search functionality.
- Character Details: View additional information about a character in a modal, including their description and image.
- Infinite Scroll: The app uses infinite scrolling to load more characters as you reach the bottom of the list.
- Error Handling: Displays error messages if the API call fails or if no results are found.
## Technologies Used
- Angular 18
- Ionic Framework 8
- TypeScript
- Marvel Comics API
- Karma/Jasmine for testing
## Installation and Setup
- Clone this repository: ```git clone https://github.com/andyco1/marvel-character-browser.git cd marvel-character-browser```
- Install the required dependencies: ```npm install```
- Add your Marvel API keys to the ```src/environments/environment.ts``` and ```src/environments/environment.prod.ts``` files.
- Start the application locally: ```ionic serve```

## Running Tests
- To run unit tests: ```ng test```

## License
This project is licensed under the MIT License.
