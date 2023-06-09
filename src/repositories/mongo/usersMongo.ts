import  {User, IUser}  from '../../schemas/userSchema';
import bcrypt from 'bcryptjs'


async function getUsers() {
  try {
    const rooms = await User.find().exec();
    return rooms;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
async function createUser(userData: IUser) {
  try {
    if (userData.password) {
      const hash = await bcrypt.hash(userData.password, 8);
      const userWithHash = { ...userData, password: hash };
      const newUser = new User(userWithHash);
      const createdUser = await newUser.save();
      
      console.log('User has been created');
      return createdUser;
    }
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
}}

async function updateUser(userId: string, updatedData: IUser) {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true
    });
    console.log('User has been updated');
    return updatedUser;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getByIdUser(userId: string): Promise<IUser | null> {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function deleteUser(userId: string): Promise<void> {
  try {
    await User.findByIdAndDelete(userId);
    console.log('User deleted succesfully');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


export const usersRepository = {
  getByIdUser,
  deleteUser,
  updateUser,
  createUser,
  getUsers
};