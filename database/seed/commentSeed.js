const faker = require('faker')

const User = require('../../models/User')
const Pic = require('../../models/Pic')
const Comment = require('../../models/Comment')

module.exports = async () => {
  const maxComments = Math.floor(Math.random() * 1) + 20

  await Comment.deleteMany({})

  const users = await User.find()
  const pics = await Pic.find()

  for (let key in pics) {
    for (let i = 0; i < maxComments; i++) {
      let rand = Math.floor(Math.random() * users.length) + 1

      if (users[rand] === undefined) { continue }

      try {
        let p = {
          description: faker.lorem.text(),
          user: users[rand]._id,
          pic: pics[key]._id
        }

        await Comment.create(p)
      } catch (err) {
        console.warn(err, 'error')
      }
    }
  }
}
