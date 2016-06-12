exports.myorders = function(req,res){
    res.render('myorders',{
        title:'我的订单',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
}