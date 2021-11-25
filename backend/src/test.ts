

// const a = function(input: string) {
//     return input
// }

// console.log(a('a'));


const posts = [
    {
      isApproved: false,
      _id: '619fd4e7142d986ddb5c2205',
      restaurant: 'A',
      city: 'A',
      meal: 'A',
      description: 'A',
      pictureKey: '16538c8625c19c1c37f1876ce2224ccd04935f83'
    }
  ]

const a = posts.find(post => post._id === '619fd4e7142d986ddb5c2205').pictureKey
console.log(typeof a);
