import { GeoJsonTypes } from 'geojson';
import { Schema, model, connect, ObjectId } from 'mongoose';

interface ICity {
    name: String,
    location: {
        type: GeoJsonTypes, coordinates: number[]
    }
}

const citySchema = new Schema<ICity>({
    name: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

const City = model<ICity>('city', citySchema, 'city');

export { City }