//@flow
import type { NetworkF } from "../dataStore";
import Query from "../Query";
import Mutation from "../Mutation";
import { schema } from "normalizr";

type Animal = {
  id: string,
  name: string,
  age: number
};
const schemaAnimal = new schema.Entity("animals");

export class AnimalsQuery extends Query<void, Animal[]> {
  uri = "/animals";
  responseSchema = [schemaAnimal];
}

export class AddAnimalMutation extends Mutation<{ animal: Object }, Animal> {
  method = "POST";
  uri = "/animals";
  responseSchema = [schemaAnimal];
  getBody() {
    return this.props.animal;
  }
}

const genId = ((id: number) => () => "id_" + ++id)(0);

const animals: Animal[] = [
  {
    id: genId(),
    name: "max",
    age: 14
  },
  {
    id: genId(),
    name: "doge",
    age: 5
  }
];

export const syncNetwork = (uri: string, method: string, body: any): any => {
  if (method === "GET" && uri === "/animals") {
    return animals;
  }
  if (method === "POST" && uri === "/animals") {
    const animal = { id: genId(), ...body };
    animals.push(animal);
    return animal;
  }
  throw "notfound";
};
