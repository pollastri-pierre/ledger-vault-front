//@flow
import Query from "../Query";
import Mutation from "../Mutation";
import { schema } from "normalizr";

// TODO add a more complex schema (2-3 models, interconnected)
// TODO some queries are cached, etc.. need to cover all possible features here

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

export class AnimalQuery extends Query<{ animalId: string }, Animal> {
  uri = "/animals/" + this.props.animalId;
  responseSchema = schemaAnimal;
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
    id: "id_max",
    name: "max",
    age: 14
  },
  {
    id: "id_doge",
    name: "doge",
    age: 5
  }
];

export const mockNetworkSync = (
  uri: string,
  method: string,
  body: any
): any => {
  let m;
  if (method === "GET" && uri === "/animals") {
    return animals;
  }
  if (method === "GET" && (m = uri.match(/^\/animals\/([^/]+)$/))) {
    const animal = animals.find(a => m && a.id === m[1]);
    if (!animal) throw "notfound";
    return animal;
  }
  if (method === "POST" && uri === "/animals") {
    const animal = { id: genId(), ...body };
    animals.push(animal);
    return animal;
  }
  throw "notfound";
};
