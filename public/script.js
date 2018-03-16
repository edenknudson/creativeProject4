//API key: d30032dc58a7c22e3f471a74999361eb

// All search requests should be made to the base search API URL. http://food2fork.com/api/search
// All recipe requests should be made to this URL: http://food2fork.com/api/get
//ex:http://food2fork.com/api/search?key={API_KEY}&q=shredded%20chicken


var app = new Vue({
  el: '#app',
  data: {
    healthRadio: "alcohol-free",
    dietRadio: "balanced",
    value: "",
    word: {},
    choice: "",
    first: 0,
    last: 10,
    results: {},
    count: 0,
    submit:true,
    source: "",
    favorite: false,
  },
  created: function() {
    this.getItems();
    this.getFoodValue();
    this.getFavorite();


    if(this.healthRadio == undefined){
      this.healthRadio = "";
    }

    if(this.dietRadio == undefined){
      this.dietRadio = "";
    }
  },
  computed:{

  },
  methods:{
    getFavorite: function(){
      axios.get("/api/favorite").then(response => {
        this.favorite = response.data;
        if(this.favorite){
          this.showFavorites();
        }
    	   return true;
          }).catch(err => {
          });
    },
    setFavorite: function(bool){
      this.favorite = bool;
      axios.post("/api/favorite", {
      show: bool,
          }).then(response => {
      return true;
          }).catch(err => {
          });
    },
    showFavorites: function(){
      this.setFavorite(true);
      this.deleteItems();
      this.getFoodValue();
      axios.get("/api/favorites").then(response => {
        this.results = response.data;
        this.source = this.results[0].image;
    	   return true;
          }).catch(err => {
          });
    },
    chooseFavorite: function(id){
      axios.put("/api/items/" + id, {
          }).then(response => {
            alert("Added to Favorites");
    	       return true;
          }).catch(err => {
          });
    },
    deleteItems: function(item) {
      axios.delete("/api/items").then(response => {
    	return true;
          }).catch(err => {
          });
    },
    getItems: function() {
      axios.get("/api/items").then(response => {
    	this.results = response.data;
      this.source = this.results[0].image;
      return true;
      }).catch(err => {
      });
    },
    getFoodValue: function() {
    //  console.log("got to getFoodValue");
      axios.get("/api/value").then(response => {
        this.word = response.data;
      //  console.log(this.word);
        this.choice = this.word.choice;
        //console.log(this.choice);
        this.first = this.word.first;
        this.last = this.word.last;
        this.healthRadio = this.word.health;
        this.dietRadio = this.word.diet;
        this.count = this.word.count;

    	return true;
          }).catch(err => {
          });

    },
    chooseNext: function(){
      this.getFoodValue();


        this.deleteItems();

      this.first = this.first + 10;
      this.last = this.last + 10;

      axios.post("/api/value", {
      choice: this.choice,
      first: this.first,
      last: this.last,
      health: this.healthRadio,
      diet: this.dietRadio,
      count: this.count
          }).then(response => {
            console.log("NEXT");
      return true;
          }).catch(err => {
          });

    //  console.log(this.choice);

      this.getFoodValue();


        if(this.healthRadio == "" && this.dietRadio == ""){
          searchNone(this.choice, this.first, this.last);
        }else if(this.healthRadio == ""){
          searchDiet(this.choice, this.diet, this.first, this.last);
        }else if(this.dietRadio == ""){
          searchHealth(this.choice, this.health, this.first, this.last);
        }else {
          searchAll(this.choice, this.dietRadio, this.healthRadio, this.first, this.last);
        }

    },
    choosePrev: function(){
      if(this.first > 0){


      this.deleteItems();
      this.getFoodValue();

      this.first = this.first - 10;
      this.last = this.last - 10;

      axios.post("/api/value", {
      choice: this.choice,
      first: this.first,
      last: this.last,
      health: this.healthRadio,
      diet: this.dietRadio,
      count: this.count
          }).then(response => {
      return true;
          }).catch(err => {
          });

      this.getFoodValue();


        if(this.healthRadio == "" && this.dietRadio == ""){
          searchNone(this.choice, this.first, this.last);
        }else if(this.healthRadio == ""){
          searchDiet(this.choice, this.diet, this.first, this.last);
        }else if(this.dietRadio == ""){
          searchHealth(this.choice, this.health, this.first, this.last);
        }else {
          searchAll(this.choice, this.dietRadio, this.healthRadio, this.first, this.last);
        }
      }
    },
    randomSearch: function(){
      this.setFavorite(false);
      axios.get("/api/random").then(response => {
    	var randomFood = response.data;
      this.value = "";
      this.value = randomFood;
      this.submitSearch();
      return true;
      }).catch(err => {
      });
    },
    submitSearch: function(){
      if(this.value !== ""){
      this.setFavorite(false);
      this.deleteItems();
      this.first = 0;
      this.last = 10;
      this.results = {};
      this.count = 0;
      this.choice = this.value;

        if(this.healthRadio == "" && this.dietRadio == ""){
          searchNone(this.value, this.first, this.last);
        }else if(this.healthRadio == ""){
          searchDiet(this.value, this.diet, this.first, this.last);
        }else if(this.dietRadio == ""){
          searchHealth(this.value, this.health, this.first, this.last);
        }else {
          searchAll(this.value, this.dietRadio, this.healthRadio, this.first, this.last);
        }
      }else{
        alert("Input a search word");
      }

    },
    publish: function(json){
      console.log(json);
      this.count = json.count;
      if(json.count == 0){
        alert("No Recipes Found")
      }
      for(i=0;i<json.hits.length;i++){
        var number = app.first + i + 1;
        var ingredients = {};
        if(json.hits[i].recipe.ingredients.length == 0){
          ingredients[0] = ({text: "None Listed"});
        }
        for(j=0;j<json.hits[i].recipe.ingredients.length;j++){
          ingredients[j] = ({text: json.hits[i].recipe.ingredients[j].text});
        }
        var cautions = {};
        if(json.hits[i].recipe.cautions.length == 0){
          cautions[0] = ("None Listed");
        }
        for(j=0;j<json.hits[i].recipe.cautions.length;j++){
          cautions[j] = (json.hits[i].recipe.cautions[j]);
        }
        axios.post("/api/items", {
      	num: number,
      	label: json.hits[i].recipe.label,
        image: json.hits[i].recipe.image,
        url: json.hits[i].recipe.url,
        cps: Math.round(json.hits[i].recipe.calories / json.hits[i].recipe.yield),
        calories: Math.round(json.hits[i].recipe.calories),
        servings: json.hits[i].recipe.yield,
        ingredients: ingredients,
        cautions: cautions
            }).then(response => {
      	this.getItems();
      	return true;
            }).catch(err => {
            });
      }
      axios.post("/api/value", {
      choice: this.choice,
      first: this.first,
      last: this.last,
      health: this.healthRadio,
      diet: this.dietRadio,
      count: this.count
          }).then(response => {
        //    console.log(this.value);
      this.value = "";
      return true;
          }).catch(err => {
          });

          this.getFoodValue();
    }
  },

});

function searchAll(value, diet, health, first, last){
  $.ajax({

    type: "GET",
    data: { q: value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", diet: diet, health: health, from: first, to: last},
    dataType: 'json',
    url: "https://api.edamam.com/search",
      //url : myurl,
      //dataType : "json",
      success : function(json) {
        app.publish(json);
      }
  });
}

function searchNone(value, first, last){
  $.ajax({

    type: "GET",
    data: { q: value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", from: first, to: last},
    dataType: 'json',
    url: "https://api.edamam.com/search",
      //url : myurl,
      //dataType : "json",
      success : function(json) {
        app.publish(json);
      }
  });
}

function searchDiet(value, diet, first, last){
  $.ajax({

    type: "GET",
    data: { q:value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", diet:diet, from: first, to:last},
    dataType: 'json',
    url: "https://api.edamam.com/search",
      //url : myurl,
      //dataType : "json",
      success : function(json) {
        app.publish(json);
      }
  });
}

function searchHealth(value, health, first, last){
  $.ajax({

    type: "GET",
    data: { q: value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", health:health, from: first, to: last},
    dataType: 'json',
    url: "https://api.edamam.com/search",
      //url : myurl,
      //dataType : "json",
      success : function(json) {
        app.publish(json);
      }
  });
}
