var contrib = require('../db/contrib');


module.exports = {
    submit: function (req, res, next){
        var id = req.params.contrib_id;
        var myContrib;
        //if there is an id
        if(id){
            myContrib = new contrib({_id : id, author: req.session.user_id, title: req.body.title, sum: req.body.sum}); 
        }else{
            myContrib = new contrib({author: req.session.user_id, title: req.body.title, sum: req.body.sum}); 
        }
        var upsertData = myContrib.toObject();
        delete upsertData._id;
        contrib.update({_id :myContrib._id},upsertData, {upsert: true}, function(err,result){
		        if(err){console.log('err : '+err);next(err);}
		        return res.redirect('/form/'+myContrib._id);
	    });
	},	
    form: function (req, res, next){
        var id = req.params.contrib_id;
        if(id){
            contrib.findOne({_id: id},function(err,result){
    		    if(err){console.log('err : '+err);next(err);}
    		    if(result){
		            return res.render('contrib_form',{menuitems:req.param.menu,contrib_id:result._id, data_title:result.title, data_sum:result.sum});
		        }
	        });
        }else{
            return res.render('contrib_form',{menuitems:req.param.menu});
        }
	},
    list: function (req, res, next){
        var user = req.session.user_id;
		contrib.find({author: user},function(err,result){
		    if(err){console.log('err : '+err);next(err);}
		    var data;
		    if (!result){
		        data = {menuitems:req.param.menu, contribs : []};
		    }else{
		        data = {menuitems:req.param.menu, contribs : result};
		    }
    		return res.render('contrib_list',data);
		});
	}
}
