var menuitems =[
    {name: 'Home', link: '/'},
    {name: 'List', link: '/list'},
    {name: 'New contribution', link: '/form'}
];

module.exports = function(req, res, next){
    req.session.user_id = 'pouic';
    req.param.menu = menuitems;
    return next();
}