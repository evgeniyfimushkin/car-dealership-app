import {Meteor} from 'meteor/meteor';
import {Mongo} from "meteor/mongo";

interface SparePart {
    id: number;                     // Уникальный идентификатор запчасти
    name: string;                   // Наименование запчасти
    car_model?: string;             // Модель автомобиля (необязательное поле)
    price: number;                  // Цена запчасти
    quantityInStock: number;        // Количество на складе
    carId: number;                  // ID автомобиля, к которому принадлежит запчасть
}


export const SparePartsCollection = new Mongo.Collection<SparePart>('sparePartsBuyers');

Meteor.methods({
    'spareParts.insert': function (sparePart) {
        // Add a new spare part
        sparePart.createdAt = new Date();
        SparePartsCollection.insertAsync(sparePart);
    },
    'spareParts.update': function (sparePartId, updatedFields) {
        // Update an existing spare part
        SparePartsCollection.updateAsync(sparePartId, {$set: updatedFields});
    },
    'spareParts.remove': function (sparePartId) {
        // Remove a spare part
        SparePartsCollection.remove(sparePartId);
    }
});


