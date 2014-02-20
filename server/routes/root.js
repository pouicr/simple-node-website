
module.exports = function (server) {
    // ### root routes
    server.get('/', function(req,res,next){
        res.render('home',{menuitems:req.param.menu,message:":-)"});
    });
};
