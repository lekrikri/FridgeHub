export const colors = {
  COLOR_PRIMARY: "#fba922",
  COLOR_LIGHT: "#eaeaea",
  COLOR_DARK_ALT: "#262626",
};
export const categories = [
  { id: "01", category: "Breakfast" },
  { id: "02", category: "Lunch" },
  { id: "03", category: "Dinner" },
  { id: "04", category: "Desserts" },
  { id: "05", category: "Vegetarian" },
  { id: "06", category: "Vegan" },
  { id: "07", category: "Gluten Free" },
  { id: "08", category: "Dairy Free" },
  { id: "09", category: "Italian" },
  { id: "10", category: "Asian" },
  { id: "11", category: "Mexican" },
  { id: "12", category: "Indian" },
  { id: "13", category: "French" },
  { id: "14", category: "Seafood" },
  { id: "15", category: "Beef" },
  { id: "16", category: "Chicken" },
  { id: "17", category: "Pork" },
  { id: "18", category: "Grains" },
  { id: "19", category: "Vegetables" },
  { id: "20", category: "Fruits" },
];

import img_Ground_Beef from "../assets/images/ingredients/beef.png";
import img_Paste from "../assets/images/ingredients/lasagne.png";
import img_Tomato_Sauce from "../assets/images/ingredients/tomato_sauce.png";
import img_Mozzarella from "../assets/images/ingredients/fromage.png";
import img_Avocado from "../assets/images/ingredients/avocado.png";
import img_Fresh_tuna from "../assets/images/ingredients/fresh_tuna.png";
import img_Lime from "../assets/images/ingredients/lime.png";
import img_Red_Onion from "../assets/images/ingredients/shallot.png";
import img_Knife from "../assets/images/ustensiles/knife.png";
import img_Cutting_Board from "../assets/images/ustensiles/cuttingBoard.png";
import img_Bowl from "../assets/images/ustensiles/largeBowl.png";
import img_Spoon from "../assets/images/ustensiles/spoon.png";


export const recipleList = [
  {
    id: "01",
    name: "Tuna Tartare",
    image: require("../assets/images/tuna.png"),
    rating: "4.2",
    ingredients: ["Fresh Tuna", "Lime Juice", "Red Onion", "Avocado"],
    ingredientImages: {
      "Fresh Tuna": img_Fresh_tuna,
      "Lime Juice": img_Lime,
      "Red Onion": img_Red_Onion,
      Avocado: img_Avocado,
    },
    time: "40 mins",
    difficulty: "Medium",
    calories: "420 cal",
    color: "#109a2c",
    description:
      "A quick and easy meal that is not only healthy but also filled with flavour and texture. Perfect for a light summer lunch or dinner.",
    ustensils: [
      {
        text: "knife",
        image: img_Knife,
      },
      {
        text: "Cutting board",
        image: img_Cutting_Board,
      },
      {
        text: "Bowl",
        image: img_Bowl,
      },
      {
        text: "Spoon",
        image: img_Spoon,
      },
    ],
    steps: [
      "Cook the chicken breast until fully cooked, then leave to cool before dicing into small pieces.",
      "Wash the lettuce, tomato, and cucumber then chop into small pieces.",
      "Combine all the ingredients in a large bowl and mix in mayo to taste.",
      "Serve immediately or refrigerate before serving.",
    ],
  },
  {
    id: "02",
    name: "Chicken Salad",
    image: require("../assets/images/chikensalad.png"),
    rating: "4.6",
    ingredients: ["Chicken Breast", "Lettuce", "Mayo", "Tomato", "Cucumber"],
    time: "20 mins",
    difficulty: "Easy",
    calories: "320 cal",
    color: "#e7c514",
    description:
      "A classic Italian comfort food that is perfect for a weekday dinner. It's a cheesy warm delight that combines beef, cheese, pasta and tomatoes into one delicious dish.",
    steps: [
      "Cook the ground beef over medium heat until brown.",
      "Boil the pasta until it's slightly undercooked.",
      "Layer a baking dish with a layer of pasta, followed by a layer of beef, followed by tomato sauce, and then mozzarella.",
      "Repeat this step until all your ingredients are used up. Make sure the last layer is a layer of cheese.",
      "Bake in an oven for 45 minutes or until the cheese is melted and the lasagna is bubbling.",
      "Let it cool for a couple of minutes then serve.",
    ],
  },
  {
    id: "03",
    name: "Beef Lasagna",
    image: require("../assets/images/beeflasagna.png"),
    rating: "4.7",
    ingredients: ["Ground Beef", "Paste", "Tomato Sauce", "Mozzarella"],
    ingredientImages: {
      "Ground Beef": img_Ground_Beef,
      Paste: img_Paste,
      "Tomato Sauce": img_Tomato_Sauce,
      Mozzarella: img_Mozzarella,
    },
    time: "90 mins",
    color: "#f39c12",
    difficulty: "Hard",
    calories: "720 cal",
    description:
      "A classic Italian comfort food that is perfect for a weekday dinner. It's a cheesy warm delight that combines beef, cheese, pasta and tomatoes into one delicious dish.",
    steps: [
      "Cook the ground beef over medium heat until brown.",
      "Boil the pasta until it's slightly undercooked.",
      "Layer a baking dish with a layer of pasta, followed by a layer of beef, followed by tomato sauce, and then mozzarella.",
      "Repeat this step until all your ingredients are used up. Make sure the last layer is a layer of cheese.",
      "Bake in an oven for 45 minutes or until the cheese is melted and the lasagna is bubbling.",
      "Let it cool for a couple of minutes then serve.",
    ],
  },
  {
    id: "04",
    name: "Vegetable Soup",
    image: require("../assets/images/vegetablesoup.png"),
    rating: "4.3",
    ingredients: ["Carrots", "Onion", "Potatoes", "Celery", "Peas"],
    time: "25 mins",
    difficulty: "Easy",
    calories: "220 cal",
    color: "#c92617",
    description:
      "A simple yet hearty soup that is filled with vitamins and nutrients. Perfect for those cold winter nights.",
    steps: [
      "Peel and chop all the vegetables into small pieces.",
      "In a large pot, sauté the onions until translucent then add the other vegetables and enough water to cover them.",
      "Bring to a boil then simmer until all the vegetables are softened.",
      "Blend the soup until smooth, or leave some vegetables whole for a chunkier soup. Season with salt and pepper, then serve.",
    ],
  },
  {
    id: "05",
    name: "Fruit Salad",
    image: require("../assets/images/fruitsalad.png"),
    rating: "4.5",
    ingredients: ["Apple", "Banana", "Orange", "Blueberries"],
    time: "10 mins",
    difficulty: "Easy",
    calories: "150 cal",
    color: "#c99717",
    description:
      "A fresh and vibrant salad that is filled with a variety of fruits. Perfect for a healthy dessert or a refreshing snack.",
    steps: [
      "Wash and chop all the fruits into small pieces.",
      "Combine all the fruits in a large bowl and mix well.",
      "Serve immediately or refrigerate before serving.",
    ],
  },
  {
    id: "06",
    name: "Vegetable Stir Fry",
    image: require("../assets/images/vegetablestirfry.png"),
    rating: "4.4",
    ingredients: ["Broccoli", "Bell Peppers", "Snow Peas", "Carrots"],
    time: "30 mins",
    difficulty: "Medium",
    calories: "300 cal",
    color: "#355b98",
    description:
      "A colourful and nutritious meal that is quick to make and packed with flavour. Perfect for a quick weeknight dinner.",
    steps: [
      "Wash and chop all the vegetables into bite-sized pieces.",
      "Heat some oil in a pan, then add the vegetables and stir fry for a few minutes until they are cooked but still crunchy.",
      "Add your favourite stir fry sauce and stir until all the vegetables are coated.",
      "Serve immediately with rice or noodles.",
    ],
  },
  {
    id: "07",
    name: "Spaghetti Carbonara",
    image: require("../assets/images/spaghetticarbonara.png"),
    rating: "4.8",
    ingredients: [
      "Spaghetti",
      "Pecorino Cheese",
      "Guanciale",
      "Eggs",
      "Pepper",
    ],
    time: "25 mins",
    difficulty: "Medium",
    calories: "567 cal",
    color: "#a1144e",
    description:
      "A classic Italian dish that is creamy, cheesy, and simply irresistible. Perfect for a weekend dinner.",
    steps: [
      "Cook the spaghetti according to the package instructions until al dente.",
      "While the pasta is cooking, cook the guanciale in a pan until crispy then remove from heat.",
      "In a bowl, beat the eggs then add the cheese and pepper.",
      "Once the pasta is done, drain it and save some of the pasta water. Add the pasta to the guanciale, then add the egg mixture and quickly mix until it forms a creamy sauce. If it's too dry, add some pasta water.",
      "Serve immediately with extra cheese on top.",
    ],
  },
  {
    id: "08",
    name: "Margherita Pizza",
    image: require("../assets/images/margheritapizza.png"),
    rating: "4.9",
    ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Fresh Basil"],
    time: "15 mins",
    difficulty: "Easy",
    calories: "270 cal",
    color: "#83297c",
    description:
      "Everyone's favourite pizza that is simple, yet incredibly delicious. Perfect for a movie night or a gathering with friends.",
    steps: [
      "Preheat your oven to the highest setting and place a pizza stone or baking sheet inside to heat up.",
      "Roll out your pizza dough on a floured surface to your desired thickness.",
      "Spread tomato sauce over the dough, leaving a border for the crust. Sprinkle the mozzarella over the sauce.",
      "Carefully transfer the pizza to the preheated stone or baking sheet and bake until the crust is golden and the cheese is bubbly and slightly browned.",
      "Top with fresh basil leaves and serve immediately.",
    ],
  },
  {
    id: "09",
    name: "Grilled Salmon",
    image: require("../assets/images/grilledsalmon.png"),
    rating: "4.7",
    ingredients: ["Salmon Fillet", "Lemon", "Olive Oil", "Salt", "Pepper"],
    time: "30 mins",
    difficulty: "Medium",
    calories: "350 cal",
    color: "#4b14af",
    description:
      "A simple and nutritious meal that brings out the natural flavours of the salmon. Perfect for a quick weeknight dinner.",
    steps: [
      "Preheat your grill or grill pan to medium heat.",
      "Season the salmon fillet with salt, pepper, a drizzle of olive oil, and a squeeze of lemon juice.",
      "Place the salmon on the grill skin side down and cook for about 4-6 minutes on each side, or until it's done to your liking.",
      "Serve immediately with a wedge of lemon on the side.",
    ],
  },
  {
    id: "10",
    name: "Chocolate Cake",
    image: require("../assets/images/chocolatecake.png"),
    rating: "4.6",
    ingredients: ["Chocolate", "Flour", "Sugar", "Eggs", "Butter"],
    time: "80 mins",
    difficulty: "Hard",
    calories: "450 cal",
    color: "#3c7c4e",
    description:
      "A rich and decadent dessert that is perfect for special occasions. This chocolate cake is sure to satisfy your sweet tooth.",
    steps: [
      "Preheat your oven to 350°F (175°C) and grease a cake tin.",
      "Melt the chocolate and butter together in a heatproof bowl over simmering water.",
      "In another bowl, mix the flour and sugar, then beat in the eggs one at a time. Stir in the melted chocolate mixture.",
      "Pour the batter into the prepared cake tin and bake for about 35-40 minutes, or until a toothpick inserted in the center comes out clean.",
      "Let the cake cool before removing from the tin, then serve with whipped cream or ice cream if desired.",
    ],
  },
];
