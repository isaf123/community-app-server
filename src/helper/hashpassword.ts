import { hash, genSalt } from 'bcrypt';

export default async function hashPassword(password, number = 10) {
  const salt = await genSalt(number);

  const hashPassword = await hash(password, salt);
  return hashPassword;
}
