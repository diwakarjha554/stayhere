import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// Property types
export interface Property {
  id?: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  images: string[];
  amenities: string[];
  status: 'active' | 'inactive';
  isFeatured?: boolean;
  rating?: number;
  reviews?: number;
  host?: {
    name: string;
    image: string;
    joined: string;
    response_rate: number;
  };
  location_description?: string;
  house_rules?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Booking types
export interface Booking {
  id?: string;
  propertyId: string;
  propertyTitle: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: Timestamp | Date;
  checkOut: Timestamp | Date;
  guests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: Timestamp;
}

// Convert Firestore document to Property
const propertyConverter = {
  toFirestore(property: Property): DocumentData {
    return {
      title: property.title,
      description: property.description,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      guests: property.guests,
      images: property.images,
      amenities: property.amenities,
      status: property.status,
      isFeatured: property.isFeatured || false,
      rating: property.rating || 0,
      reviews: property.reviews || 0,
      host: property.host,
      location_description: property.location_description,
      house_rules: property.house_rules,
      updatedAt: serverTimestamp(),
      createdAt: property.createdAt || serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Property {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      guests: data.guests,
      images: data.images,
      amenities: data.amenities,
      status: data.status,
      isFeatured: data.isFeatured,
      rating: data.rating,
      reviews: data.reviews,
      host: data.host,
      location_description: data.location_description,
      house_rules: data.house_rules,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Property services
export const propertyService = {
  // Get all properties
  async getProperties() {
    try {
      const propertiesRef = collection(db, 'properties').withConverter(
        propertyConverter,
      );
      const snapshot = await getDocs(propertiesRef);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error('Error getting properties:', error);
      // Return empty array instead of throwing error
      return [];
    }
  },

  // Get featured properties
  async getFeaturedProperties() {
    try {
      const propertiesRef = collection(db, 'properties').withConverter(
        propertyConverter,
      );
      const q = query(propertiesRef, where('isFeatured', '==', true), limit(4));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error('Error getting featured properties:', error);
      // Return empty array instead of throwing error
      return [];
    }
  },

  // Get property by ID
  async getPropertyById(id: string) {
    try {
      const propertyRef = doc(db, 'properties', id).withConverter(
        propertyConverter,
      );
      const snapshot = await getDoc(propertyRef);
      if (!snapshot.exists()) return null;
      return snapshot.data();
    } catch (error) {
      console.error('Error getting property by ID:', error);
      return null;
    }
  },

  // Create property
  async createProperty(property: Property) {
    const propertiesRef = collection(db, 'properties').withConverter(
      propertyConverter,
    );
    const docRef = await addDoc(propertiesRef, property);
    return docRef.id;
  },

  // Update property
  async updateProperty(id: string, property: Partial<Property>) {
    const propertyRef = doc(db, 'properties', id);
    await updateDoc(propertyRef, {
      ...property,
      updatedAt: serverTimestamp(),
    });
  },

  // Delete property
  async deleteProperty(id: string) {
    const propertyRef = doc(db, 'properties', id);
    await deleteDoc(propertyRef);
  },

  // Upload property image
  async uploadPropertyImage(file: File, propertyId: string) {
    const storageRef = ref(storage, `properties/${propertyId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  },
};

// Booking services
export const bookingService = {
  // Create booking
  async createBooking(booking: Booking) {
    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, {
      ...booking,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Get bookings by property ID
  async getBookingsByPropertyId(propertyId: string) {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('propertyId', '==', propertyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get bookings by user email
  async getBookingsByUserEmail(email: string) {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Update booking status
  async updateBookingStatus(
    id: string,
    status: 'pending' | 'confirmed' | 'cancelled',
  ) {
    const bookingRef = doc(db, 'bookings', id);
    await updateDoc(bookingRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  },
};

// Destination types
export interface Destination {
  id?: string;
  name: string;
  properties: number;
  image: string;
}

// Destination services
export const destinationService = {
  // Get popular destinations
  async getPopularDestinations() {
    try {
      const destinationsRef = collection(db, 'destinations');
      const q = query(destinationsRef, orderBy('properties', 'desc'), limit(6));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting popular destinations:', error);
      return [];
    }
  },
};
