/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var axios = require('axios');

var mongoDbUtilities = require('./../mongodb-util');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){

      console.log('/api/stock-price GET');

      var stocks = req.query.stock;
      let urls = [];
      let stockData ={};
 
      if(stocks === undefined || stocks.length === 0){
        return res.send("unknown stock")
      }else{

        if(typeof stocks === "string"){
          urls.push(axios.get("https://repeated-alpaca.glitch.me/v1/stock/"+req.query.stock+"/quote"));
        }else{

          for(let i = 0; i < 2; i++){
             urls.push(axios.get("https://repeated-alpaca.glitch.me/v1/stock/"+req.query.stock[i]+"/quote"));
          }
        }
        
        // call api
        axios.all(urls).then(axios.spread((...responses) => {
      
          let ip = (req.headers['x-forwarded-for'] + "").split(",")[0];

          if(urls.length === 1){
            stockData.stockData = [{
              stock: responses[0].data.symbol,
              price: responses[0].data.latestPrice,
              ip: ip,
              like: req.query.like === undefined ? false : true
            }];
          }else{
            stockData.stockData = []

            for(let i = 0; i < responses.length; i++){
              stockData.stockData.push({
                stock: responses[i].data.symbol,
                price: responses[i].data.latestPrice,
                ip: ip,
                like: false
              })
            }
          }

          mongoDbUtilities.connectToServer((state)=>{
            if(state.status){
              
              mongoDbUtilities.queryStock(stockData.stockData, callback => {
                return res.json(callback);
              });

            }else{
              return res.send("unable to connect to database");
            }
          });

        })).catch(errors => {
          console.log(errors);
          return res.send("error getting stocks");
        }) 
        
      }
    })
    
    .post(function(req, res){
      console.log('/api/stock-price POST');

      var stocks = req.body.stock;

      if(stocks === undefined || stocks.length === 0){
        return res.send("unknown stock")
      }else{
        let urls = [];

        if((typeof stocks) === "string"){
          urls.push(axios.get("https://repeated-alpaca.glitch.me/v1/stock/"+ stocks +"/quote"));
        }else{
          stocks.forEach(stock =>{
            urls.push(axios.get("https://repeated-alpaca.glitch.me/v1/stock/"+ stock +"/quote"));
          })
        }

        // call api
        axios.all(urls).then(axios.spread((...responses) => {

          const keys = Object.keys(responses);
          let validQuery = true;

          // run check
          keys.forEach((key) => {
            if(responses[key].data === "Not found"){
              validQuery = false;
            }
          })

          // valid stock data
          if(validQuery){
            
            mongoDbUtilities.connectToServer((state)=>{

              let ip = (req.headers['x-forwarded-for'] + "").split(",")[0];

              // stock data
              let stockData = {};
              stockData.stockData = [];
              
              keys.forEach(key => {
                stockData.stockData.push({
                  stock: responses[key].data.symbol,
                  price: responses[key].data.latestPrice,
                  ip: ip,
                  like: req.body.like === undefined ? false : true
                })
              })

              if(state.status){
                mongoDbUtilities.queryStock(stockData.stockData, callback => {
                  return res.json(callback);
                });
              }else{
                return res.send("unable to connect to database");
              }
            })
          }else{
            return res.send("unknown stock");
          }
        }))
        .catch(errors => {
          return res.send("unknown stock");
        }) 
      }
    }); // end of post


    
};
