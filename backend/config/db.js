import mongoose from 'mongoose';
import dns from 'dns'
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(`${process.env.MONGO_URI}EVENTORA`);
        console.log("Connection Successful!");
    } catch(error){
        console.error("Connection failed", error.message);
        process.exit(1);
    }
}

export default connectDB;