
import { GeoJsonTypes } from 'geojson';
import { Schema, model, ObjectId, Date, Types } from 'mongoose';

enum restaurantStatus {
    REJECTED = -1,
    PENDING = 0,
    ACCEPTED = 1
}

enum courierStatus {
    FAILED = -1,
    PENDING = 0,
    COMPLETED = 1
}

enum orderStatus {
    CANCELED = -1,
    PENDING = 0,
    COMPLETED = 1
}

interface IItem {
    menuId: String,
    qty: number
}

interface IAddress {
    street: String,
    number: String,
    city: String,
    location: {
         type: GeoJsonTypes, coordinates: number[]
    }
}

interface IOrder {
    items: [IItem]
    amount: number,
    userId: ObjectId,
    restaurantId: ObjectId,
    date: Date,
    courier: ObjectId,
    deliveryTime: String,
    deliveryId: String,
    transactionId: String,
    address: IAddress,
    restaurantStatus: restaurantStatus,
    courierStatus: courierStatus,
    status: orderStatus
}

const itemSchema = new Schema<IItem>({
    menuId: { type: Schema.Types.ObjectId, required: true },
    qty: { type: Number, required: true }
});

const addressSchema = new Schema<IAddress>({
    street: { type: String, required: true },
    number: { type: String, required: true },
    city: { type: String, required: true },
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

addressSchema.index({ 'location': '2dsphere' });

const orderSchema = new Schema<IOrder>({
    items: [itemSchema],
    amount: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'restaurant', required: true },
    date: { type: Date, required: true },
    courier: { type: Schema.Types.ObjectId, ref: 'courier', required: false },
    deliveryTime: { type: String,  required: true, enum: ['1200', '1215', '1230', '1245', '1300', '1315', '1330', '1345', '1400', 
        '1900', '1915', '1930', '1945', '2000', '2015', '2030', '2045', '2100'] },
    deliveryId: { type: String, required: false },
    transactionId: { type: String, required: true },
    address: addressSchema,
    restaurantStatus: { required: true, type: Number, enum: restaurantStatus },
    courierStatus: { required: true, type: Number, enum: courierStatus },
    status: { required: true, type: Number, enum: orderStatus }
});

const Order = model<IOrder>('order', orderSchema, 'order');

export { Order, restaurantStatus, courierStatus, orderStatus, IAddress, IItem }