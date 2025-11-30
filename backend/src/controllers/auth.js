import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export const register = async (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const {name,email,password,role} = req.body;
  try {
    let user = await User.findOne({email});
    if(user) return res.status(400).json({msg:'User already exists'});
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    user = new User({name,email,password:hashed, role: role || 'user'});
    await user.save();
    const payload = {user:{id:user.id, role:user.role}};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '1d'});
    res.json({token});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const login = async (req,res) => {
  const {email,password} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({msg:'Invalid credentials'});
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({msg:'Invalid credentials'});
    const payload = {user:{id:user.id, role:user.role}};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '1d'});
    res.json({token});
  } catch(err){
    console.error(err);
    res.status(500).send('Server error');
  }
};
