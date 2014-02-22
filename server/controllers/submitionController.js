var Contrib = require('../db/contrib');


module.exports = {
    submit: function (req, res, next){
        var id = req.params.contrib_id;
        var myContrib;
        //if there is an id
        if(id){
            myContrib = Contrib.findOne({_id: id},function(err,result){
                if(err){console.log('err : '+err); return next(err);}
                if(result){
                    if(result.author != req.session.user_id){
                       return res.send(403);
                    }
                    myContrib = result;
                    myContrib.title = req.body.title;
                    myContrib.sum = req.body.sum;
                    myContrib.save(function(err,result){
                        if(err){console.log('err : '+err); return next(err);}
		                return res.redirect('/form/'+myContrib._id);
                    });
                }else{
                    return res.redirect('/form');
                }
            });
        }else{
            myContrib = new Contrib({author: req.session.user_id, title: req.body.title, sum: req.body.sum});
            myContrib.save(function(err,result){
                if(err){console.log('err : '+err); return next(err);}
		        return res.redirect('/form/'+result._id);
           });
        }
	},	
    form: function (req, res, next){
        var id = req.params.contrib_id;
        if(id){
            Contrib.findOne({_id: id},function(err,result){
    		    if(err){console.log('err : '+err);next(err);}
    		    if(result){
                    if(result.author != req.session.user_id){
                        return res.send(403);
                    }
		            return res.render('contrib_form',{menuitems:req.param.menu,contrib_id:result._id, data_title:result.title, data_sum:result.sum});
		        }
	        });
        }else{
            return res.render('contrib_form',{menuitems:req.param.menu});
        }
	},
    list: function (req, res, next){
        var user = req.session.user_id;
		Contrib.find({author: user},function(err,result){
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
