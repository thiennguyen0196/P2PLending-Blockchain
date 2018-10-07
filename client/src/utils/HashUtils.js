import bcrypt from 'react-native-bcrypt';
import { Bcrypt } from '../Constant';

class HashUtils {
    static hashPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, Bcrypt.SALT, (error, hash) => {
                if (error) {
                    return reject(error);
                }
                return resolve(hash);
            });
        });
    }
}

export default HashUtils;
