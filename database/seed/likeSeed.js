
const User = require('../../models/User')
const Pic = require('../../models/Pic')
const Like = require('../../models/Like')
/*
 * method to seed some likes
 * @Function seeder
 * */
module.exports = async () => {
  const maxLikes = Math.floor(Math.random() * 1) + 20

  await Like.deleteMany({})

  const users = await User.find()
  const pics = await Pic.find()

  for (let key in pics) {
    for (let i = 0; i < maxLikes; i++) {
      let rand = Math.floor(Math.random() * users.length) + 1

      if (users[rand] === undefined) { continue }

      try {
        let p = {
          user: users[rand]._id,
          pic: pics[key]._id
        }

        await Like.create(p)
      } catch (err) {
        console.warn(err, 'error')
      }
    }
  }
}
