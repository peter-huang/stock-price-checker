/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          if(err){
            done(err)
          }
          assert.equal(res.body.stockData.stock, "GOOG");
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'grpn'})
        .end(function(err, res){
          if(err){
            done(err)
          }
          assert.equal(res.body.stockData.likes, 2);
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'grpn'})
        .end(function(err, res){
          if(err){
            done(err)
          }
          assert.equal(res.body.stockData.likes, 2);
          done();
        });
        
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices?stock=grpn&stock=quot')
        .end(function(err, res){
          if(err){
            done(err)
          }
          assert.equal(res.body.stockData[0].stock, "GRPN");
          assert.equal(res.body.stockData[0].rel_likes, 2);
          assert.equal(res.body.stockData[1].stock, "QUOT")
          assert.equal(res.body.stockData[1].rel_likes, -2);
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices?stock=grpn&stock=quot&like=true')
        .end(function(err, res){
          if(err){
            done(err)
          }
          assert.equal(res.body.stockData[0].stock, "GRPN");
          assert.equal(res.body.stockData[0].rel_likes, 2);
          assert.equal(res.body.stockData[1].stock, "QUOT")
          assert.equal(res.body.stockData[1].rel_likes, -2);
          expect(res.body.stockData[0].rel_likes).to.be.above(res.body.stockData[1].rel_likes);
          done();
        }); 
      });
      
    });

});
