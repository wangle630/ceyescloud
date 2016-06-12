(function ($) {

   $.fn.pickList = function (options) {

      var opts = $.extend([], $.fn.pickList.defaults, options);


      this.fill = function () {
         var option = '';
		 var optionresult = '';
         $.each(opts.data, function (key, val) {
			if(this.type == 1)
				optionresult += '<option  id ='+this.id+'>' + this.text + '</option>';
			else
				option += '<option   id='+this.id+'>' + this.text + '</option>';
         });

         this.find('#pickData').append(option);
		 this.find('#pickListResult').append(optionresult);
         $("#pickids").val(JSON.stringify(this.getValues()));
      };
      this.controll = function () {
         var pickThis = this;
		$("#pickData").dblclick(function(){  
            var p = pickThis.find("#pickData option:selected");
			p.clone().appendTo("#pickListResult");
            p.remove();
       		$("#pickids").val(JSON.stringify(pickThis.getValues()));

         });
		$("#pickListResult").dblclick(function(){  
            var p = pickThis.find("#pickListResult option:selected");
			p.clone().appendTo("#pickData");
            p.remove();
           $("#pickids").val(JSON.stringify(pickThis.getValues()));
         });	
			

         $("#pAdd").on('click', function () {
            var p = pickThis.find("#pickData option:selected");
            p.clone().appendTo("#pickListResult");
            p.remove();
            $("#pickids").val(JSON.stringify(pickThis.getValues()));
         });

         $("#pAddAll").on('click', function () {
            var p = pickThis.find("#pickData option");
            p.clone().appendTo("#pickListResult");
            p.remove();
            $("#pickids").val(JSON.stringify(pickThis.getValues()));
         });

         $("#pRemove").on('click', function () {
            var p = pickThis.find("#pickListResult option:selected");
            p.clone().appendTo("#pickData");
            p.remove();
            $("#pickids").val(JSON.stringify(pickThis.getValues()));
         });

         $("#pRemoveAll").on('click', function () {
            var p = pickThis.find("#pickListResult option");
            p.clone().appendTo("#pickData");
            p.remove();
            $("#pickids").val(JSON.stringify(pickThis.getValues()));
         });
      };
      this.getValues = function () {
         var objResult = [];
         this.find("#pickListResult option").each(function () {
            objResult.push({id: this.id, text: this.text});
         });
         return objResult;
      };
      this.close   = function(){
         $("#pickData").remove();
         $("#pickListResult").remove();
         $("#btns").remove();

         opts.data == null;
      }
      this.init = function () {
         var pickListHtml =
             "<div class='row'>" +
             "  <div class='col-sm-5'>" +
             "	 <select class='form-control pickListSelect' id='pickData' multiple></select>" +
             " </div>" +
             " <div id='btns' class='col-sm-2 pickListButtons'>" +
             "	<a id='pAdd' class='btn btn-primary btn-sm'>></a></br>" +
             "   <a id='pAddAll' class='btn btn-primary btn-sm'>>></a></br>" +
             "	<a id='pRemove' class='btn btn-primary btn-sm'><</a></br>" +
             "	<a id='pRemoveAll' class='btn btn-primary btn-sm'><<</a></br>" +
             " </div>" +
             " <div class='col-sm-5'>" +
             "    <select class='form-control pickListSelect' id='pickListResult' multiple></select>" +
             " </div>" +
             "</div>";


         this.append(pickListHtml);

         this.fill();
         this.controll();
      };

      this.init();
      return this;
   };

   $.fn.pickList.defaults = {
      add: 'Add',
      addAll: 'Add All',
      remove: 'Remove',
      removeAll: 'Remove All'
   };


}(jQuery));


