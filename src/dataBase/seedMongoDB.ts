import { faker } from '@faker-js/faker';
import { User } from "../schemas/userSchema";
import Room  from "../schemas/roomSchema";
import { Booking } from "../schemas/bookingSchema";
import { connectMongoDB, disconnectMongoDB } from './mongoConnector';

export const convertToDateFormat = (date: Date) =>  {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateFormated = `${year}-${month}-${day}`;
  return dateFormated;
}

const generateSeedData = async () => {
    await connectMongoDB();
    for (let i = 0; i < 16; i++) {
        try {
          
            const user = new User( {
                name: faker.internet.userName(),
                photo: faker.image.avatar(),
                email: faker.internet.email(),
                startDate: convertToDateFormat(faker.date.past()),
                descriptionJob: faker.lorem.sentence(),
                contact: faker.number.int({ min: 60000000, max: 79999999 }),
                isActive: faker.datatype.boolean(),
                password: faker.string.alphanumeric()
                
            });
            await user.save()
        }
        catch (error) {
            console.log(error)
            throw error
        }
    };
    for (let i = 0; i < 16; i++) {

        try {
            const room = new Room({
                roomName: faker.string.alphanumeric(),
                isAvailable: faker.datatype.boolean(),
                price: faker.number.int({ min: 500, max: 1000 }),
                offerPrice: faker.number.int({ min: 0, max: 499 }),
                roomNumber: faker.number.int({ min: 1, max: 1000 }),
                roomType: faker.string.fromCharacters(['Single', 'Double Bed', 'Double Superior', 'Suite']),
                amenities: [faker.internet.userName(), faker.internet.userName(), faker.internet.userName(), faker.internet.userName()],
                photos: [faker.image.url(), faker.image.url(), faker.image.url()]
            });
            await room.save();

            const booking = new Booking ({
                guest: faker.internet.userName(),
                orderDate: convertToDateFormat(faker.date.past({ years: 2023 })),
                checkIn: convertToDateFormat(faker.date.past()),
                checkOut: convertToDateFormat(faker.date.future()),
                specialRequest: faker.lorem.sentences(),
                roomObj: room,
                status: faker.string.fromCharacters(['Check In', 'Check Out', 'In Progress']),
            });
            await booking.save()
        }
        catch (error) {
            console.log(error)
            throw error
        }

    };
    console.log("Data created correctly!")
    await disconnectMongoDB();
};

const deleteAllRooms = async () => {
  try {
    await Room.deleteMany({});
    console.log('All rooms data deleted successfully.');
  } catch (error) {
    console.log('Error deleting data:', error);
  }
};

const deleteAllBookings = async () => {
    try {
      await Booking.deleteMany({});
      console.log('All bookings data deleted successfully.');
    } catch (error) {
      console.log('Error deleting data:', error);
    }
  };

  const deleteAllUsers = async () => {
    try {
      await User.deleteMany({});
      console.log('All users data deleted successfully.');
    } catch (error) {
      console.log('Error deleting data:', error);
    }
  };
  const deleteAllDataBase = async () =>{
    try{
      await deleteAllUsers();
      await deleteAllBookings();
      await deleteAllRooms();
      console.log('All data base has been successfully deleted.');
    }
    catch(error){
      console.log(error)
    }
  }
  deleteAllDataBase()
  generateSeedData()