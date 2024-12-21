import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import {EmployeesCollection} from "/imports/api/employees";
import {CarsCollection} from "/imports/api/cars";
import {CustomerSellersCollection} from "/imports/api/customerSeller";
import {CustomerBuyersCollection} from "/imports/api/customerBuyer";
import {SparePartsCollection} from "/imports/api/sparePart";

Meteor.methods({
    'users.register': async (username, password) => {
        console.log('Регистрация пользователя:', username);

        // Проверка, что имя пользователя и пароль переданы
        if (!username || !password) {
            console.log('Ошибка: Имя пользователя или пароль не указаны');
            throw new Meteor.Error('400', 'Имя пользователя и пароль обязательны');
        }

        // Проверка, существует ли уже такой пользователь
        const existingUser = await Accounts.findUserByUsername(username);  // Используем await
        console.log('Найден пользователь:', existingUser);

        if (existingUser) {
            console.log('Ошибка: Пользователь с таким именем уже существует');
            throw new Meteor.Error('403', 'Пользователь с таким именем уже существует');
        }

        // Создание нового пользователя
        try {
            const userId = await Accounts.createUser({
                username,
                password,
            });
            console.log('Пользователь создан:', userId);
            return userId;
        } catch (error) {
            console.log('Ошибка при создании пользователя:', error);
            throw new Meteor.Error('500', 'Ошибка при создании пользователя');
        }
    },
});
Meteor.publish('cars', function () {
    if (this.userId) {
        // Публикуем коллекцию, если пользователь авторизован
        return CarsCollection.find();
    } else {
        // Если пользователь не авторизован, возвращаем пустой массив
        return [];
    }
});
Meteor.publish('employees', function () {
    if (this.userId) {
        // Публикуем коллекцию, если пользователь авторизован
        return EmployeesCollection.find();
    } else {
        // Если пользователь не авторизован, возвращаем пустой массив
        return [];
    }
});
Meteor.publish('customerSellers', function () {
    if (this.userId) {
        // Публикуем коллекцию, если пользователь авторизован
        return CustomerSellersCollection.find();
    } else {
        // Если пользователь не авторизован, возвращаем пустой массив
        return [];
    }
});
Meteor.publish('customerBuyers', function () {
    if (this.userId) {
        // Публикуем коллекцию, если пользователь авторизован
        return CustomerBuyersCollection.find();
    } else {
        // Если пользователь не авторизован, возвращаем пустой массив
        return [];
    }
});
Meteor.publish('spareParts', function () {
    if (this.userId) {
        // Публикуем коллекцию, если пользователь авторизован
        return SparePartsCollection.find();
    } else {
        // Если пользователь не авторизован, возвращаем пустой массив
        return [];
    }
});