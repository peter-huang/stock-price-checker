# Stock Price Checker

A full stack application that provides stock pricing based on the Nasdaq ticker for the Freecodecamp curriculum.

**Final Project:** [https://fcc-stock-price-checker.phuang.repl.co/](https://fcc-stock-price-checker.phuang.repl.co/)

**User Story #1:** Set the content security policies to only allow loading of scripts and css from your server.

**User Story #2:** I can GET /api/stock-prices with form data containing a Nasdaq stock ticker and recieve back an object stockData.

**User Story #3:** In stockData, I can see the stock(string, the ticker), price(decimal in string format), and likes(int).

**User Story #4:** I can also pass along field like as true(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.

**User Story #5:** If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes, it will display rel_likes(the difference between the likes on both) on both.

**User Story #6:** A good way to receive current price is the following external API(replacing 'GOOG' with your stock): https://repeated-alpaca.glitch.me/v1/stock/goog/quote

**User Story #7:** All 5 functional tests are complete and passing.

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Built With

- [Node](https://nodejs.org/en/) - JavaScript runtime environment
- [MongoDB](https://www.mongodb.com/) - NoSQL database

## Authors

- **Peter Huang** - Principal developer - [Portfolio](https://www.peterhuang.net/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
