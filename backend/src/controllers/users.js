import User from '../models/User.js';
export const getProfile = async (req,res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch(err){
    console.error(err); res.status(500).send('Server error');
  }
};
export const getAllUsers = async (req,res) => {
  try{
    const users = await User.find().select('-password');
    res.json(users);
  }catch(err){console.error(err); res.status(500).send('Server error');}
};
