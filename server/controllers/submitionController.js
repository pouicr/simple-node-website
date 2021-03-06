var Contrib = require('../db/contrib'),
    fs = require('fs'),
    path = require('path'),
    mime = require('mime');

var submit = function (req, res, next){
    var id = req.params.contrib_id;
    var myContrib;
    //if there is an id
    if(id){
        myContrib = Contrib.findOne({_id: id},function(err,result){
            if(err){console.log('err : '+err); return next(err);}
            if(result){
                if(result.author != req.session.user.id){
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
                return res.send(403);
            }
        });
    }else{
        myContrib = new Contrib({author: req.session.user.id, title: req.body.title, sum: req.body.sum});
        myContrib.save(function(err,result){
            if(err){console.log('err : '+err); return next(err);}
	        return res.redirect('/form/'+result._id);
       });
    }
};

var form = function (req, res, next){
    var id = req.params.contrib_id;
    if(id){
        Contrib.findOne({_id: id},function(err,result){
		    if(err){console.log('err : '+err); return next(err);}
		    if(result){
                if(result.author != req.session.user.id){
                    return res.send(403);
                }
	            return res.render('contrib_form',{user:req.session.user,contrib : result});
	        }
        });
    }else{
        return res.render('contrib_form',{user:req.session.user,contrib:{}});
    }
};


var upload = function (req, res, next){
    var id = req.params.contrib_id;
    if(id){
        Contrib.findOne({_id: id},function(err,result){
		    if(err){console.log('err : '+err); return next(err);}
		    if(result){
                if(result.author != req.session.user.id){
                    return res.send(403);
                }
                console.log('start uploading : '+req.files.teaser);
                result.teaser.contentType = req.files.teaser.type;
                result.teaser.data = fs.readFileSync(req.files.teaser.path);
                console.log('stop uploading ! ');
                result.save(function(err,resultagain){
                    if(err){console.log('err : '+err); return next(err);}
	                return res.render('contrib_form',{user:req.session.user,contrib : resultagain});
                });
	        }
        });
    }else{
        return res.send(404);;
    }
};

var uploadFs = function (req, res, next){
    var id = req.params.contrib_id;
    if(id){
        Contrib.findOne({_id: id},function(err,result){
		    if(err){console.log('err : '+err); return next(err);}
		    if(result){
                if(result.author != req.session.user.id){
                    return res.send(403);
                }
                console.log('start uploading fs: '+req.files.teaser);
                fs.readFile(req.files.teaser.path, function (err, data) {
                    var newPath = path.join(__dirname, '..','..', 'uploads',id);
                    fs.writeFile(newPath, data, function (err) {
                        if(err){console.log('err : '+err); return next(err);}
                        console.log('stop uploading fs: ');
                        return res.render('contrib_form',{user:req.session.user,contrib : result});
                    });
                });
	        }
        });
    }else{
        return res.send(404);;
    }
};

var getUpload = function (req, res, next){
    var id = req.params.contrib_id || '5311100160d4ff3b13577eed';
    if(id){
    
        Contrib.findOne({_id: id},function(err,result){
		    if(err){console.log('err : '+err); return next(err);}
		    if(result){
                res.setHeader('Content-Type', 'image/png');
                res.send(result.teaser.data);  
	        }
        });
    }else{
        return res.send(404);;
    }
};

var getUploadFs = function (req, res, next){
    var id = req.params.contrib_id || '5311100160d4ff3b13577eed';
    if(id){
    
        Contrib.findOne({_id: id},function(err,result){
		    if(err){console.log('err : '+err); return next(err);}
		    if(result){
                var aPath = path.join(__dirname, '..','..', 'uploads',id);
                var mimetype = mime.lookup(aPath);

                res.setHeader('Content-disposition', 'attachment; filename=' + aPath);
                res.setHeader('Content-type', mimetype);
                
                res.download(aPath);  
	        }
        });
    }else{
        return res.send(404);;
    }
};

var list = function (req, res, next){
	Contrib.find({author: req.session.user.id},function(err,result){
	    if(err){console.log('err : '+err); return next(err);}
	    var data;
	    if (!result){
	        data = {user:req.session.user, contribs : []};
	    }else{
	        data = {user:req.session.user, contribs : result};
	    }
		return res.render('contrib_list',data);
	});
};


var validate = function (req, res, next){
    var id = req.params.contrib_id;
    if (!req.body.title || !req.body.sum){
        req.params.error = 'Missing required data';
        return res.render('contrib_form',{user:req.session.user,error:'Missing required data',contrib : {_id:req.params.contrib_id, title: req.body.title, sum: req.body.sum}});
    }else{
        return next();
    }
};

var csv_export = function (req, res, next){
    if(req.session.user.admin){
        return res.send(403);
    }else{
        Contrib.find({},function(err,result){
            if(err){console.log('err : '+err); return next(err);}
            var data = "";
            result.forEach(function (contrib) {
                data += contrib.author;
                data += "; " + contrib.title;
                data += "; " + contrib.sum;
                data += "\n";
            });
            res.header('Content-type', 'text/csv');
            res.send(data);
        });
    }
};
module.exports = {
    submit : submit,
    validate : validate,
    upload : upload,
    getupload : getUpload,
    uploadfs : uploadFs,
    getuploadfs : getUploadFs,
    form : form,
    list : list,
    csv_export : csv_export
}
