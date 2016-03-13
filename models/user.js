var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/fotos");

var posibles_valores = ["M","F"];
var password_validation = {
	type:String,
	required:true,
	minlength:[8,"La contraseña es muy corta"],
	validate:{
		validator:function(p) {
			return this.password_confirmation == p;
		},
		message:"Las contraseñas no son iguales"
	}
}

var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Coloca un email valido"];
var user_schema = new Schema({	
	name:String,
	last_name:String,
	username:{type:String,required:true,maxlength:[50,"El nombre es muy largo"]},
	password:password_validation,
	age:{type:Number,min:[5,"La edad no debe ser menor a 5"],max:[100,"La eded no debe ser mayor a 100"]},
	email:{type:String,required:"El correo es Obligatorio",match:email_match},
	date_of_birth:Date,
	sexo:{type:String,enum:posibles_valores,message:"Opcion no valida"}
});

user_schema.virtual('password_confirmation').get(function () {
	return this.p_c;
}).set(function (password) {
	this.p_c = password;
});

user_schema.virtual('full_name').get(function () {
	return this.name + this.last_name;;
}).set(function (full_name) {
	var words = full_name.split(" ");
	this.name = words[0];
	this.last_name = words[1];
});

var User = mongoose.model("User",user_schema);

module.exports.User = User;