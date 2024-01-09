const { getNullableType } = require('graphql');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const root = {
  createUser: async ({ username, password, email_id }) => {
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email_id }] });

      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      // No bcrypt hashing for the password
      const newUser = new User({ username, password, email_id });
      await newUser.save();

      // Log the user and id information
    console.log('New User:', newUser);
    console.log('New User ID:', newUser._id);

      // Set the id field explicitly if _id is available
    if (newUser._id) {
      newUser.id = newUser._id;
    }

      // Include the id in the response
      return { id: newUser._id, username: newUser.username, email_id: newUser.email_id, message: 'User created successfully' };
    } catch (error) {
      // Handle errors during user creation
      throw new Error(`Error creating user: ${error.message}`);
    }
  },
  
  login: async ({ username, password }, context) => {
    try {
      const user = await User.findOne({ username }, { id: 1 , username: 1 , password: 1 , email_id:1 });
      console.log("User data from database:", user);

      if (!user) {
        console.error(`User with username '${username}' not found`);
        throw new Error('Invalid username');
      }

      // No bcrypt hashing for the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.error(`Invalid password for user '${username}'`);
        console.log("Received password:", password);
        console.log("Stored password:", user.password);
        throw new Error('Invalid password');
      }

      context.req.session.user = { id: user._id, username: user.username };
       // Include the id in the response
    return { id: user._id, username: user.username,  email_id: user.email_id, message: 'Login successful'}; // Include other fields as needed

    } catch (error) {
      console.error(error);
      throw new Error(`Error during login: ${error.message}`);
    }
  }
};

module.exports = root;
