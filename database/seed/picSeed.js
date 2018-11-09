const faker = require('faker')

const User = require('../../models/User')
const Pic = require('../../models/Pic')

module.exports = async () => {
  const maxPics = 5

  await Pic.deleteMany({})

  const users = await User.find()

  for (let key in users) {
    for (let i = 0; i < maxPics; i++) {
      try {
        let p = {
          url: 'https://picsum.photos/200',
          description: faker.lorem.text(),
          user: users[key]._id
        }

        await Pic.create(p)
      } catch (err) {
        console.warn(err, 'error')
      }
    }
  }
}
