//call back 예제 안씀

const Q = require('q');

function getRandomNumber() {
  let deferred = Q.defer();
  setTimeout(function() {
    console.log('Delayed Job Complete!');
    let rand = Math.random();
    if (rand > 0.3) {
      deferred.resolve(rand);
    } else {
      deferred.reject({ message: 'Random number is lower than 0.3.' });
    }
  }, 1000);
  return deferred.promise;
}

getRandomNumber()
.then(function(result) {
  console.log('1st Random number:', result);
  return getRandomNumber();
})
.then(function(result) {
  console.log('2nd Random number:', result);
})
.catch(function(err) {
  console.log('Error ocuured:', err.message);
});
