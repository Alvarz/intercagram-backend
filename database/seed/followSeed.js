
const User = require('../../models/User')
const Follow = require('../../models/Follow')

module.exports = async () => {
  Follow.deleteMany({})
  const maxFollowPerUser = 3

  const users = await User.find({})

  users.forEach(async (u) => {
    for (let i = 0; i < maxFollowPerUser; i++) {
      let rand = Math.floor(Math.random() * users.length) + 1

      if (u === undefined || users[rand] === undefined) { return }

      try {
        let f = {
          follower: users[rand]._id,
          followed: u.id
        }
        await Follow.create(f)
      } catch (err) {
        console.warn(err)
      }
    }
  })
}
