import dotenv from "dotenv";

dotenv.config();

const env = {
    port:process.env.PORT,
    issuer_base_url:process.env.ISSUER_BASE_URL,
    client_id:process.env.CLIENT_ID,
    base_url:process.env.BASE_URL,
    auth_secret:process.env.AUTH_SECRET,
    mongo_url: process.env.MONGO_URL,
    jwt_secret: process.env.JWT_SECRET
}

export default env

/* PORT: 5000
ISSUER_BASE_URL=https://dev-665el7fhub8kb850.us.auth0.com
CLIENT_ID=hY6GmU8EPDn95WrTp1oh7ZdppANLT9sQ
BASE_URL=http://localhost:5000
AUTH_SECRET=mongodb+srv://bobbyrosehag:sByMd5UKhDvr784@trivialweb.jbrgi.mongodb.net/trivialweb?retryWrites=true&w=majority
MONGO_URL=sByMd5UKhDvr784 */