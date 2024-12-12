import {Mongo} from "meteor/mongo";
import {Employee} from "/imports/api/entity/employee.types";

export const Employees = new Mongo.Collection<Employee>('employees');