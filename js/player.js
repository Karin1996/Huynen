//Get json files
let player_json = require("../local_db/player.json");
let model_json = require("../local_db/model.json");

//Player definition
let player;
player = player_json;

//Find the model in model_json that corresponds with the model_id in the player object
let player_model = model_json.find(obj=> obj.model_id === player.model_id);
//Add the correct object from model_json to player object
player.modelinfo = player_model;

//Export player object
export {player};