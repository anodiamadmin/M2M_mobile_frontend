import { MOCK_BIKES } from "./mockBikeData";

export const bikeService = {
  // Simulate GET /my-bookings
  getMyBookings: async () => {
    return new Promise((resolve) => {
      // Returns the FULL list of 20 bikes (as per your snippet)
      setTimeout(() => resolve(MOCK_BIKES), 500); 
    });
  },

  // ✅ ADDED: This is called by the Booking Details screen
  getAvailableBikes: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_BIKES), 500);
    });
  },

  // Simulate GET /bikes (The Explore Feed)
  getAllBikes: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_BIKES), 500);
    });
  },

  // Simulate GET /bikes/:id
  getBikeById: async (id) => {
    return new Promise((resolve, reject) => {
      const bike = MOCK_BIKES.find((b) => b.id === id);
      setTimeout(() => {
        if (bike) resolve(bike);
        else reject(new Error("Bike not found"));
      }, 300);
    });
  }
};