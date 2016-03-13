var express = require('express');
var bodyParser = require('body-parser');
var User = require('./models/user').User;
var session = require('express-session');
var router_app = require('./routes_app');
var session_middleware = require('./middleware/session');
var app = express(); //ejecutar express

app.use("/public",express.static("public"));

app.use(bodyParser.json()); // para aplication/json
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
	secret:"hsdgf34344hghjgh65654646",
	resave:false,
	saveUninitialized:false
}));

app.set("view engine","jade"); //seleccionar motor de vistas

app.get("/",function(req,res) {
	console.log(req.session.user_id);
	res.render("index",{nombre:'carlos'});
});

app.get("/signup",function(req,res) {
	User.find(function (err,doc) {
		console.log(doc);
		res.render("signup");
	});		
});

app.get("/login",function(req,res) {
	res.render("login");
});

app.post("/users",function(req,res) {
	var user = new User({
							email:req.body.email, 
							password:req.body.password, 
							password_confirmation:req.body.password_confirmation,
							username:req.body.username
						});

	user.save().then(function(us) {
		res.send("Guardamos tus datos");
	},function (err) {
		if (err) {
			console.log(String(err));
			res.send("No pudimos Guardar tus datos");
		}
	});
});

app.post("/sessions",function(req,res) {
	console.log('hola en session')
	User.findOne({email:req.body.email,password:req.body.password},function (err,user) {
		req.session.user_id = user._id;		
		res.redirect("/app");
	});
});

app.get("/cerrar",function(req,res) {
	req.session.destroy();		
	res.redirect("/");
});

app.use("/app",session_middleware);
app.use("/app",router_app);
app.listen(81);