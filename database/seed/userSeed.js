const faker = require('faker')

const User = require('../../models/User')

module.exports = async () => {
  const maxUsers = 100

  await User.deleteMany({})

  for (let i = 0; i < maxUsers; i++) {
    try {
      let u = {
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        nickname: faker.internet.userName(),
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
        token: faker.random.uuid
      }

      await User.create(u)
    } catch (err) {
      console.warn(err)
    }
  }
}
