const bcrypt = require('bcrypt');

module.exports = {

  async up(db, client) {
    const hashedPassword = await bcrypt.hash('admin121', 10);
    const role = await db.collection('roles').findOne({ name: 'admin' });
    const admin = {
      firstName : 'Prathamesh',
      lastName  : 'Patil',
      email     : 'prathm@gmail.com',
      password  : hashedPassword,
      role      : role._id,
      createdAt : new Date(),
      updatedAt : new Date(),
      isDeleted : false,
      deletedBy : null
    }
    await db.collection('users').insertOne(admin);
  },

  async down(db, client) {
    await db.collection('users').deleteOne({ email: 'pratham@gmail.com' })
  }
};
