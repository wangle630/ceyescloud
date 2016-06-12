exports.mybills = function(req,res){
    res.render('mybills',{
        title:'账单纪录',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
}