import bcrypt from 'bcrypt'

export async function hashPassword(password:string) {
    try {
      const saltRounds = 10; 
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw error;
    }
  }