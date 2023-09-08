import { graphqlHTTP } from "express-graphql";
import { buildSchema, assertInputType } from "graphql";
import express from "express";


// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: ({ id }) => restaurants.find(restaurant => restaurant.id === id),
  restaurants: () => restaurants,
  setrestaurant: ({ input }) => {
    const newId = Math.max(...restaurants.map(r => r.id)) + 1; // Assign next highest ID
    const newRestaurant = { id: newId, ...input, dishes: [] }; // Assuming new restaurants start with no dishes
    restaurants.push(newRestaurant);
    return newRestaurant;
},
deleterestaurant: ({ id }) => {
  const restaurantIndex = restaurants.findIndex(restaurant => restaurant.id === id);
  if (restaurantIndex !== -1) {
      restaurants.splice(restaurantIndex, 1);
      return { ok: true };
  }
  return { ok: false };
},
editrestaurant: ({ id, name }) => {
  const restaurant = restaurants.find(restaurant => restaurant.id === id);
  if (!restaurant) {
      throw new Error("restaurant doesn't exist");
  }
  restaurant.name = name;  // Currently only updating name. Add other fields as required.
  return restaurant;
},
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

export default root;
