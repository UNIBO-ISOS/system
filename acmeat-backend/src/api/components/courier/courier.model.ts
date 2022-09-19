import { GeoJsonTypes } from 'geojson';
import { Schema, model, connect, ObjectId } from 'mongoose';

interface ICourier {
    name: String,
    user: ObjectId,
    location: {
        type: GeoJsonTypes, coordinates: number[]
    }
}

const courierSchema = new Schema<ICourier>({
    name: { type: String, required: true },
    user: { required: true, ref: 'user', type: Schema.Types.ObjectId },
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

courierSchema.index({ 'location': '2dsphere' });

const Courier = model<ICourier>('courier', courierSchema, 'courier');

export { Courier }