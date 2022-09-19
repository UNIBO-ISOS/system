import { ObjectEncodingOptions } from "fs";
import { GeoJsonTypes } from "geojson";
import { Schema, model, ObjectId, Date } from 'mongoose';
import { Order } from "../order/order.model";
import { IAddress, IItem } from '../order/order.model';

interface IAuction {
    orderId: ObjectId,
    courierId: ObjectId,
    amount: number,
    receiveDate: Date,
}

const auctionSchema = new Schema<IAuction>({
    orderId: { type: Schema.Types.ObjectId, ref: 'order', required: true },
    courierId: { type: Schema.Types.ObjectId, ref: 'courier', required: true },
    amount: { type: Number, required: true },
    receiveDate: { type: Date, required: true }
})

const Auction = model<IAuction>('auction', auctionSchema, 'auction')

export { Auction }