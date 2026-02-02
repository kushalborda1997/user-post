import dotenv from 'dotenv';
dotenv.config();

export default {
    tokenSecret     : process.env.TOKEN_SECRET as string,
    dbUri           : process.env.DB_URI as string,
    port            : +process.env.PORT! || 8081,
    bcryptSalt      : +process.env.SALT! || 10!,
    adminPassword   : process.env.ADMIN_PASSWORD as string
}