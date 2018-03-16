const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

let items = [];
let id = 0;
let value = {};
let favorites = [];
let favorite = false;
let randomFood = ["pasta", "chicken", "beef", "salad", "pie", "cake", "carrot", "burger", "curry", "sandwich", "sauce", "soup", "vegetable", "juice", "beans", "peppers", "tomatoes", "potatoes", "cereal", "cheese", "rice", "bread", "taco", "fish", "turkey", "salsa", "oil", "vinegar", "fries", "toast", "steak", "chowder", "chocolate", "milk", "corn", "crab", "eggs", "onion", "candy", "jam", "peanut", "pepperoni", "popcorn", "muffin", "ribs", "pancake", "mango", "apple", "pineapple", "banana", "kiwi", "fruit", "peas", "wheat", "gravy", "avacado", "almond", "bacon", "bagel", "barley", "broccoli", "burritto", "chips", "eggroll", "fondu", "grapes", "gumbo", "granola", "garlic", "crackers", "ham", "honey", "hummus", "sushi", "ice cream", "lasagna", "meatballs", "oatmeal", "yams", "omelet", "smoothie", "spicy", "raisins", "strawberry", "mexican", "chinese", "nacho", "fried", "green beans", "cinnamon", "rolls", "chili", "wrap", "ranch"];

app.get('/api/items', (req, res) => {
  res.send(items);
});

app.get('/api/favorite', (req, res) => {
  res.send(favorite);
});

app.get('/api/value', (req, res) => {
  res.send(value);
});

app.get('/api/favorites', (req, res) => {
  items.concat(favorites);
  res.send(favorites);
});

app.get('/api/random', (req, res) => {
  let food = randomFood[Math.floor(Math.random()*randomFood.length)];
  res.send(food);
});

app.post('/api/items', (req, res) => {
  id = id + 1;
  let item = {id:id, num:req.body.num, label:req.body.label, image:req.body.image, url: req.body.url, calories: req.body.calories, servings: req.body.servings, cps: req.body.cps, ingredients: req.body.ingredients, cautions: req.body.cautions};
  items.push(item);
  res.send(item);
});

app.post('/api/value', (req, res) => {
  value = {choice: req.body.choice, first: req.body.first, last: req.body.last, health: req.body.health, diet: req.body.diet, count: req.body.count};
  res.send(value);

});

app.post('/api/favorite', (req, res) => {
  favorite = req.body.show;
  res.sendStatus(200);
});


app.put('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  for(var i = 0; i < items.length; i ++){
    if(items[i].id == id){
        favorites.push(items[i]);
    }
  }
  res.sendStatus(200);
});


app.delete('/api/items', (req, res) => {
  items.splice(0, items.length);
  res.sendStatus(200);
});

app.listen(3030, () => console.log('Server listening on port 3000!'))
