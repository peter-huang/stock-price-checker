"use strict";

const mongo = require("mongodb");
const ObjectID = require("mongodb").ObjectID;

var _db;
module.exports = {
  /*
   * Connects to the database
   *
   * @return callback - status message
   */
  connectToServer: function (callback) {
    mongo.connect(
      process.env.DB,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        _db = client.db("<dbname>");
        err
          ? callback({ status: false, message: err })
          : callback({
              status: true,
              message: "Successfully connected to database",
            });
      }
    );
  },

  /*
   * Returns the database object
   *
   */
  getDb: function () {
    return _db;
  },

  /*
   * Get number of likes
   *
   * @return callback -
   *
   */
  getLikes: function (item, callback) {},

  /*
   * Query stock
   *
   * @return callback -
   *
   */
  queryStock: function (items, callback) {
    //console.log(item)

    const keys = Object.keys(items);
    let searchTerms = [];
    keys.forEach((key) => {
      searchTerms.push(items[key].stock);
    });

    // check if stock exists
    _db
      .collection("stocks")
      .find({ stock: { $in: searchTerms } })
      .toArray((err, res) => {
        if (res.length === 0) {
          this.insertStock(items, (cb) => callback(cb));
        } else {
          this.updateStock(res, items, (cb) => callback(cb));
        }
      });
  },

  /*
   * Update stock price
   *
   * @return callback - callback message
   *
   */
  updateStock: function (oldItems, newItems, callback) {
    console.log("updateStock");

    let updateItems = [];
    let searchTerms = [];

    for (let i = 0; i < newItems.length; i++) {
      newItems[i].toInsert = true;

      for (let j = 0; j < oldItems.length; j++) {
        if (newItems[i].stock === oldItems[j].stock) {
          newItems[i].toInsert = false;
        }
      }
    }

    for (let i = 0; i < newItems.length; i++) {
      let updateStatement = {};
      searchTerms.push(newItems[i].stock);

      if (!newItems[i].toInsert) {
        updateStatement = {
          updateOne: {
            filter: {
              stock: newItems[i].stock,
            },
            update: {
              $set: {
                price: newItems[i].price,
              },
            },
          },
        };

        for (let j = 0; j < oldItems.length; j++) {
          if (newItems[i].stock === oldItems[j].stock && newItems[i].like) {
            if (!this.isDuplicateIp(newItems[i].ip, oldItems[j].likes)) {
              updateStatement.updateOne.update["$push"] = {
                likes: newItems[i].ip,
              };
            }
          }
        }
      } else {
        updateStatement = {
          insertOne: {
            _id: ObjectID(),
            stock: newItems[i].stock,
            price: newItems[i].price,
            likes: newItems[i].like ? [newItems[i].ip] : [],
          },
        };
      }

      updateItems.push(updateStatement);
    }

    _db.collection("stocks").bulkWrite(updateItems, (err, res) => {
      if (err) {
        callback(err);
      } else {
        _db
          .collection("stocks")
          .find({ stock: { $in: searchTerms } })
          .toArray((e, r) => {
            if (e) {
              callback(e);
            } else {
              callback(this.formatDataObj(r));
            }
          });
      }
    });
  },

  /*
   * Insert stock(s)
   *
   * @return callback - callback message
   *
   */
  insertStock: function (items, callback) {
    console.log("insertStock");

    if (items.length === 1) {
      let r = {
        _id: ObjectID(),
        stock: items[0].stock,
        price: items[0].price,
        likes: items[0].like ? [items[0].ip] : [],
      };

      _db
        .collection("stocks")
        .insertOne(r)
        .then((res) => {
          callback(this.formatDataObj(res.ops));
        })
        .catch((err) => {
          callback(err);
        });
    } else {
      const keys = Object.keys(items);
      let r = [];
      keys.forEach((key) => {
        r.push({
          _id: ObjectID(),
          stock: items[key].stock,
          price: items[key].price,
          likes: items[key].like ? [items[key].ip] : [],
        });
      });

      _db
        .collection("stocks")
        .insertMany(r)
        .then((res) => {
          callback(this.formatDataObj(res.ops));
        })
        .catch((err) => {
          callback(err);
        });
    }
  },

  /*
   * Check if ip already exists in ip ipPool
   *
   * @param ip - ip address
   * @param ipPool - array of ip pool
   *
   * @return bool - true if ip exists in pool or false otherwise
   */
  isDuplicateIp: function (ip, ipPool) {
    for (let i = 0; i < ipPool.length; i++) {
      if (ip === ipPool[i]) {
        return true;
      }
    }
    return false;
  },

  /*
   * Formats stock(s) for response JSON format
   *
   * @param item - unformatted JSON data object
   *
   * @return result - formatted JSON data object
   */
  formatDataObj: function (items) {
    const keys = Object.keys(items);
    let result = {};

    if (items.length === 1) {
      result.stockData = {
        stock: items[keys[0]].stock,
        price: items[keys[0]].price,
        likes: items[keys[0]].likes.length,
      };
    } else {
      result.stockData = [];

      for (let i = 0; i < items.length; i++) {
        result.stockData[i] = {
          stock: items[i].stock,
          price: items[i].price,
        };
        if (i === 0) {
          result.stockData[i].rel_likes =
            items[i].likes.length - items[i + 1].likes.length;
        } else {
          result.stockData[i].rel_likes =
            items[i].likes.length - items[i - 1].likes.length;
        }
      }
    }

    return result;
  },
};
