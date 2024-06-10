import { Admin, db } from "../server/model.js";
import adminData from './adminData.json' assert { type: 'json' }

const seedDatabase = async () => {
    await db.sync({ force: true });
    
    const adminsInDb = await Promise.all(
        adminData.map((admin) => {
            const { userName, password } = admin
            const newAdmin = Admin.create({
                userName,
                password
            })
            
            return newAdmin;
        })
    )

    await db.close();
};

seedDatabase().catch((error) => {
  console.error('Error during seeding:', error);
});