var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: 'nRkFoued97iTDSmA0j4sJA',
  consumer_secret: '84oo6Wz9Llfcmd5E8mxbba9390k',
  token: 'V6IBAABe7ksj-pO1OLDkIN-b7q6H1aFs',
  token_secret: '0j69oXI2k2Jnd1Dk7TyMeSKVvQo',
});
 
exports.getPOI = function (req, res) {
  console.log(req.params.city.replace('_',' '));
  yelp.search({ term: 'tourist attraction', location: req.params.city.replace('_',' ') })
  .then(function (data) {
    res.send(data);
    // console.log(data);
  })
  .catch(function (err) {
    console.error(err);
  });
}
// See http://www.yelp.com/developers/documentation/v2/search_api

// See http://www.yelp.com/developers/documentation/v2/business
// yelp.business('yelp-san-francisco')
//   .then(console.log)
//   .catch(console.error);

// yelp.phoneSearch({ phone: '+15555555555' })
//   .then(console.log)
//   .catch(console.error);

// // A callback based API is also available:
// yelp.business('yelp-san-francisco', function(err, data) {
//   if (err) return console.log(error);
//   console.log(data);
// });
  //have my JSON object, do whatever we want here, like add to spreadsheets