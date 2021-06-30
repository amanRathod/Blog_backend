const mongoose = require('mongoose')

// const UserSchema =  new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//   },
//   lastName: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   accounts: [
//     { type: mongoose.Schema.Types.ObjectId,
//       ref: 'Google_User',
//       
//     },
//     { type: mongoose.Schema.Types.ObjectId,
//       ref: 'Login_User',
//       
//     },
//     { type: mongoose.Schema.Types.ObjectId,
//       ref: 'Github_User',
//       
//     }
//  ]
// })

const UserSchema =  new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  expireToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  accounts: [
    { 
      kind: {
        type: String,
        enum: ["google","internal","github"],
        required: true
        }, 
      googleId: {
         type: String
       },
      image: {
          type: String
        },
      password: {
          type: String,
        },
      githubId: {
        type: String,
        }
  }
],

})



// const Login_User = new mongoose.Schema({
//   password: {
//     type: String,
//     required: true,
//     minilength: 6,
//   }
// })

module.exports = mongoose.model('User', UserSchema);





