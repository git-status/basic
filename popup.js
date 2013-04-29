// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Search the bookmarks when entering the search keyword.

 $(document).ready(function () {
     if ($("[rel=tooltip]").length) {
     $("[rel=tooltip]").tooltip();
     }
   });

global_loc_store=new Array();

var my_cl_bkmk_app = {};
my_cl_bkmk_app.webdb = {};
my_cl_bkmk_app.statuses={0: 'This posting has been deleted by Author', 1:'Available', 2:'This posting has expired',3:'Unchecked'};
my_cl_bkmk_app.delete_dialog_options={};

$(document).ready(function(){
	console.log('starting bookmark extension..');

	//user controls at top of from

	//clear selection
	$('#btn_clear').click(function() {
		$('tr input:checkbox').prop('checked',false);
		
	});
	//$('#btn_clear').tooltip();
	//end clear selection

	//DeleteSelected
	$('#btn_delete_selected').click(function() {
			var n = $( "input:checked" ).length;
			deleted_items='<h5>Delete '+n+' items?</h5>';
		$('tr.error input:checkbox').each(function( index ) {
			deleted_items+= '<p>'+index + ': ' + $('td#edit_bmk_'+$(this).attr('data-rid')).text()+'</p>';
		});
		
          $('#deletedialog').empty().dialog({
                 autoOpen: false,
                 title: 'Confirm Delete--Posts Deleted by Author',
                 resizable: true,
                 minHeight: 140,
		minWidth:200,
                 modal: true,
                 overlay: {
                   backgroundColor: '#000',
                   opacity: 0.5
                 },
                 buttons: {
                   'Yes, Delete It!': function() {

			$('tr.error input:checkbox').each(function( index ) {
				var this_item=$('td#edit_bmk_'+$(this).attr('data-rid')).text();
				var this_item_id=$(this).attr('data-rid');				 
				chrome.bookmarks.remove(this_item_id, function (){
						console.log('Removed Bookmark #ID: '+this_item_id+' - ',this_item);
					}				
				);
				delete_from_websql(this_item_id);				
			});
                     
                      //span.parent().remove();
                      $(this).dialog('destroy');
                    },
                    Cancel: function() {
                      $(this).dialog('destroy');
                    }
                 }
               }).append(deleted_items).dialog('open');
		
		
	});
	//ENd DeleteSelected
	
	//select posts deleted.
	var deleted_items;
	$('#btn_select_deleted').click(function() {
		
		$('tr.error input:checkbox').prop('checked',true);
		
         });
	//select delete posts expired
	$('#btn_select_expired').click(function() {
		$('tr.warning input:checkbox').prop('checked',true);
         });

	//refresh
	$('#btn_refresh').click(function() {
		//Looks at all bookmarks in websql that are not status 0-deleted or 2-expired
			db.transaction(function(tx){
				tx.executeSql('SELECT * FROM cl_ads WHERE ad_status NOT IN (0,2,)', null, function (tx, results){ 
						if(results.rows.length>0){
							//console.log('fn.get_websql_bkmks');
							for (var i=0;i<results.rows.length;i++){

								just_use_load(results.rows.item(i).ad_url,results.rows.item(i).id);
								//update_websql_status							
							}
														
						}else{
							console.log('fn.get_websql_bkmks:none available'); 
							tbl_data='';
							return tbl_data;
						}}, null, my_cl_bkmk_app.webdb.onError); 
							
			});
		
		
		
         });

	//end refresh
	
	//drop websql
		$('#btn_drop_websql').click(function() {
		$('tr.warning input:checkbox').prop('checked',true);
          $('#deletedialog').empty().dialog({
                 autoOpen: false,
                 title: 'Confirm Drop WebSQL',
                 resizable: false,
                 height: 140,
                 modal: true,
                 overlay: {
                   backgroundColor: '#000',
                   opacity: 0.5
                 },
                 buttons: {
                   'Yes, Drop WebSQL Db!': function() {
                      //chrome.bookmarks.remove(String(bookmarkNode.id));
			var db = openDatabase('cl_db', '1.0', 'database of ads & statuses', 2 * 1024 * 1024);
			db.transaction(function (tx) {
				  tx.executeSql('DROP TABLE cl_ads', null, null, my_cl_bkmk_app.webdb.onSuccess, my_cl_bkmk_app.webdb.onError);
			});
			
                      //span.parent().remove();
                      $(this).dialog('destroy');
                    },
                    Cancel: function() {
                      $(this).dialog('destroy');
                    }
                 }
               }).dialog('open');
         });
	//end drop websql

	//end user controls

	var db = openDatabase('cl_db', '1.0', 'database of ads & statuses', 2 * 1024 * 1024);
	
	//begin delete from websql
	var delete_from_websql=function(sel){
		//if is a single selction delete this or flatten with underscore and delete all items..	
		db.transaction(function (tx) {
				  tx.executeSql('DELETE FROM cl_ads WHERE id=?', sel, null, my_cl_bkmk_app.webdb.onSuccess, my_cl_bkmk_app.webdb.onError);
		});
		
	}
	//end delete from websql
	
	//init database
	var init_db=function(){
			db.transaction(function(tx){
				tx.executeSql('CREATE TABLE IF NOT EXISTS cl_ads (id unique, ad_url, ad_title, ad_status, date_added)');		
			});
		};	
	//end init database

	//begin save to websql
	var save_to_websql= function(bkmk_itm){
	
				db.transaction(function (tx) {
				  tx.executeSql('CREATE TABLE IF NOT EXISTS cl_ads (id unique, ad_url, ad_title, ad_status, date_added)');
				  tx.executeSql('SELECT * FROM cl_ads WHERE id=?',[bkmk_itm.id],function (tx, results) {
						if (results.rows.length>0){
							tx.executeSql('UPDATE cl_ads SET ad_status=? WHERE id=?', [bkmk_itm.ad_status, bkmk_itm.id],my_cl_bkmk_app.webdb.onSuccess,my_cl_bkmk_app.webdb.onError);
						}else{
							tx.executeSql('INSERT INTO cl_ads (id, ad_url, ad_title, ad_status, date_added) VALUES (?, ?, ?, ?, ?)', 
			[bkmk_itm.id, bkmk_itm.ad_url, bkmk_itm.ad_title, bkmk_itm.ad_status,bkmk_itm.date_added],my_cl_bkmk_app.webdb.onSuccess,my_cl_bkmk_app.webdb.onError);													
						}
					}

				);
			});
	};
	//end save to websql

	//begin refresh from websql
		var refresh_from_websql= function(bkmk_itm){
	
				db.transaction(function (tx) {
				  tx.executeSql('SELECT * FROM cl_ads WHERE ad_status NOT IN (0,2,)','',function (tx, results) {
						if (results.rows.length>0){
							for (var i=0;i<results.rows.length;i++){
								just_use_load(results.rows.item(i).ad_url, results.rows.item(i).id);
							}
						}else{
							//return nothing to update message
							console.log('nothing to update');													
						}
					}, my_cl_bkmk_app.webdb.onSuccess, my_cl_bkmk_app.webdb.onError);

				});
			};
//end refresh

	//update_websql
	var update_websql=function(itm){
				db.transaction(function (tx) {
					tx.executeSql('UPDATE cl_ads SET ad_status=? WHERE id=?', [itm.ad_status, itm.id], my_cl_bkmk_app.webdb.onSuccess,my_cl_bkmk_app.webdb.onError);
				});
						
			};
	//end_update_websql

	//begin in_websql
	var in_websql=function(id){
			db.transaction(function(tx){
				tx.executeSql('SELECT * FROM cl_ads WHERE id=?', [id], function (tx, results){ 
						if(results.rows.length>0 && results.rows.length<2){
							 //r.rows.item(i).cityname;
							console.log('fn.in_websql Ad_status for #'+id+':',results.rows.item(0).ad_status);
							if(results.rows.item(0).ad_status==0 || results.rows.item(0).ad_status==2){
								console.log('fn.in_websql status=(0|2) skip',id); 
								return true;
							}else{
								console.log('fn.in_websql status=1 at last REfresh..skip',id); 
								return true;
							}
						}else{
							console.log('fn.in_websql Not in websql',id); 
							return false;
						}}, my_cl_bkmk_app.webdb.onError); 
							
			});	
		}
	//end_in_websql

//begin delete_from_websql
	var delete_from_websql=function(id){
			db.transaction(function(tx){
				tx.executeSql('DELETE FROM cl_ads WHERE id=?', id, function (tx, results){ 
						if(results.rows.length>0){
							 //r.rows.item(i).cityname;
							console.log('fn.delete_from_websql #'+id+':',results.rows.item(0).ad_status);
							if(results.rows.item(0).ad_status==0 || results.rows.item(0).ad_status==2){
								console.log('fn.in_websql status=(0|2) skip',id); 
								return true;
							}else{
								console.log('fn.in_websql status=1 at last REfresh..skip',id); 
								return true;
							}
						}else{
							console.log('fn.delete_from_websql Not in websql',id); 
							return false;
						}}, my_cl_bkmk_app.webdb.onError); 
							
			});	
		}
	//end_delete_from_websql

	//begin get_websql_bkmks
	var get_websql_bkmks=function(){
				tbl_data='';
				db.transaction(function(tx){
				tx.executeSql('SELECT * FROM cl_ads', null, function (tx, results){ 
						if(results.rows.length>0){
							console.log('fn.get_websql_bkmks');
							for (var i=0;i<results.rows.length;i++){
								console.log('id:'+results.rows.item(i).id+' row value ad_title:',results.rows.item(i).ad_title);
tbl_data+='<tr class="'+statusCodeToClass(results.rows.item(i).ad_status)+'" id="row_'+results.rows.item(i).id+'" data-rid="'+results.rows.item(i).id+'"><td><input data-rid="'+results.rows.item(i).id+'" type="checkbox"/><i class="icon-remove-circle"></i></td><td>'+results.rows.item(i).date_added+'</td><td id="edit_bmk_'+results.rows.item(i).id+'">'+results.rows.item(i).ad_title+'</td><td><a href="'+results.rows.item(i).ad_url+'">'+results.rows.item(i).ad_url+'</a></td><td class="status_'+results.rows.item(i).id+'">'+my_cl_bkmk_app.statuses[results.rows.item(i).ad_status]+'</td></tr>';
							}
						$('div#bookmark_search table.table tbody').append(tbl_data);
							
						}else{
							console.log('fn.get_websql_bkmks:none available'); 
							tbl_data='';
							return tbl_data;
						}}, null, my_cl_bkmk_app.webdb.onError); 
							
			});
			
	}
	//end_get_websql_bkmks
		

	//begin main script
	var dfd = $.Deferred();

	dfd.done(chrome.bookmarks.search("craigslist.org", function(loop_results){
		init_db();	 	
		var i;
		for (i = 0; i < loop_results.length; i++) {
			
		      	var this_bm_date=new Date(loop_results[i].dateAdded);
			var this_display_date=(this_bm_date.getMonth()+1)+'/'			
						+this_bm_date.getDate()+'/'
						+this_bm_date.getFullYear();
			console.log('Loading bookmarks#'+i+'('+loop_results[i].id+') into table:',loop_results[i].url);                    			
			
			//save to websql skip localstore shit
				var this_bkmk ={
					id:loop_results[i].id, 
					ad_url:loop_results[i].url, 
					ad_title:loop_results[i].title, 
					ad_status:3,
					date_added:this_display_date
				};
				
			//checking if in webql
				if (in_websql(loop_results[i].id)){
					console.log('Status in websql doing nothing#',loop_results[i].id);
					//defer ajax loading until user clicks status check..					
					//use_load(loop_results[i].url,loop_results[i].id);
				}else{
					save_to_websql(this_bkmk);
					console.log('New Bookmark initial load of websql status',loop_results[i].id);
					//defer ajax loading until user clicks status check..
					//use_load(loop_results[i].url,loop_results[i].id);
				}
			
		}
			//load bookmarks from Websql not bookmarkstorage..all the rows..
			var this_tbl=get_websql_bkmks();
			//alert ('this_tbl_string'+this_tbl);
			//$('div#bookmark_search table.table tbody').append(this_tbl);
			//
			
	})
	).done();
//end main script

	//create result element within loop..
	var result_elem=function(){
				$('div#cl_temp').append('<div class="results_'+loop_results[i].id+'"></div>');
			};
	//end create result element
	//begin use_load
	var use_load=function(url,idx){
	var result=null;
	$("div.results_"+idx).load(url+' div.removed h2', '', 
		function(responseText, textStatus, XMLHttpRequest) {
			var msg;
			if (textStatus == 'error') {
				var msg = "Sorry but there was an error: ";
				msg+= XMLHttpRequest.status + " " + XMLHttpRequest.statusText;
				console.log('fn.use_load error msg#'+idx+': ',msg);
			}else{
				console.log('fn.use_loading response');

				if (true){
					console.log('fn.use_load response#'+idx+': ',responseText.slice(0,50));
					thehtml=$(responseText).find('div.removed h2').text();;				
					console.log('find()#'+idx+':',thehtml);
					var this_stat=(thehtml||"Available");
					console.log('ad_status',this_stat);
					$('tr#row_'+idx).addClass(statusClasses(thehtml));
					$('td.status_'+idx).text(this_stat);
					msg=thehtml;
				}else{
					console.log('fn.use_load wtf');		
	
				}

				console.log('{id:'+idx+',ad_status:'+thehtml+'}');
				var stat_itm= new Array();
				stat_itm[idx]={id:idx, ad_status:statusCode(thehtml)};
				update_websql(stat_itm[idx]);
				
			}
			return msg;
		}
	);

};
//end use_load

	//begin just_use_load
	var just_use_load=function(url,idx){
	var result=null;
	$("div.results_"+idx).load(url+' div.removed h2', '', 
		function(responseText, textStatus, XMLHttpRequest) {
			var msg;
			if (textStatus == 'error') {
				var msg = "Sorry but there was an error: ";
				msg+= XMLHttpRequest.status + " " + XMLHttpRequest.statusText;
				console.log('fn.just_use_load error msg#'+idx+': ',msg);
			}else{

					console.log('fn.just_use_load response#'+idx+': ',responseText.slice(0,50));
					thehtml=$(responseText).find('div.removed h2').text();;				
					console.log('find()#'+idx+':',thehtml);
					var this_stat=(thehtml||"Available");
					console.log('ad_status',this_stat);
					$('tr#row_'+idx).addClass(statusClasses(thehtml));
					$('td.status_'+idx).text(this_stat);
					msg=thehtml;
				

				console.log('{id:'+idx+',ad_status:'+thehtml+'}');
				var stat_itm= new Array();
				stat_itm[idx]={id:idx, ad_status:statusCode(thehtml)};
				update_websql(stat_itm[idx]);
				
			}
			return msg;
		}
	);

};
//end just_use_load


});


function status_text(stat_string_html){
	if($(this).stat_string_html==undefined){
		return '<button type="button" class="btn btn-success">|'+typeof(stat_string_html)+'|'+stat_string_html.value+'|</button>'+list_properties(stat_string_html);
	}else if ($(this).stat_string_html.find('h2').text()!=null){
		return '<button type="button" class="btn btn-danger">Deleted</button>';
	}else{
		return '<button type="button" class="btn btn-inverse">WTF</button>';
		//return $().stat_string_html.find('h2').innerText();	
	}
}

function list_properties(obj){
	if (typeof(obj)=="object"){
		return $(obj).val();
	var props=$('<ul>');
	for(var propertyName in obj) {
	   // propertyName is what you want
	   // you can get the value like this: myObject[propertyName]
		props.append(obj[propertyName]);
	
	}
	return props;
	}else{
		return typeof(obj);
	}
}

//view-source:http://icant.co.uk/articles/crossdomain-ajax-with-jquery/reusable-ajax.html
function use_get(url,idx){  
$.get(url+' div.removed h2',
    function(code){
      code=code.replace(/&/mg,'&#38;');
      code=code.replace(/</mg,'&#60;');
      code=code.replace(/>/mg,'&#62;');
      code=code.replace(/\"/mg,'&#34;');
      code=code.replace(/\t/g,'  ');
      code=code.replace(/\r?\n/g,'<br>');
      code=code.replace(/<br><br>/g,'<br>');
      code=code.replace(/ /g,'&nbsp;');
      $('#code').html('<pre><code>'+code+'</code></pre>');
    }
  );
	console.log('fn.use_get code: ',code);
	return code;
//store to local storage here .. chop off everything except the h2.. call it a day.
//make separate function to populate post status...
}

//Used to add status CSS zebra colors to <table><tr>
function statusClasses(statText){
	switch(statText)
	{
	case "This posting has been deleted by its author.":
		return 'error';
	  break;
	case "This posting has expired.":
	  	return 'warning';
	  break;
	default:
		return 'success';
		break;
	}
	
}

function statusCodeToClass(stat_code){
	switch(stat_code)
	{
	case 0:
		return 'error';
	  break;
	case 2:
	  	return 'warning';
	  break;
	case 1:
		return 'success';
		break;
	default:
		return 'success';
		break;
	}
	
}

function statusCode(statText){
	switch(statText)
	{
	case "This posting has been deleted by its author.":
		return 0;
	  break;
	case "This posting has expired.":
	  	return 2;
	  break;
	default:
		return 1;
		break;
	}
}
//AJAX plugin that I did not use..
//http://stackoverflow.com/questions/905298/jquery-storing-ajax-response-into-global-variable
jQuery.extend
(
{
    getValues: function(url) 
    {
        var result = null;
        $.ajax(
            {
                url: url,
                type: 'get',
                dataType: 'html',
                async: false,
                cache: false,
                success: function(data) 
                {
                    result = data;
			console.log('jQuery.fn.getValues sucess: ',data);
                },
		error: function(error)
		{
			console.log('jQuery.fn.getValues error: ',error);
		}
            }
        );
       //return result;
    
	}
}

);

// Option List 1, when "Cats" is selected elsewhere
  //  optList1_Cats += $.getValues("/MyData.aspx?iListNum=1&sVal=cats");

    // Option List 1, when "Dogs" is selected elsewhere
    //optList1_Dogs += $.getValues("/MyData.aspx?iListNum=1&sVal=dogs");

    // Option List 2, when "Cats" is selected elsewhere
    //optList2_Cats += $.getValues("/MyData.aspx?iListNum=2&sVal=cats");

    // Option List 2, when "Dogs" is selected elsewhere
//    optList2_Dogs += $.getValues("/MyData.aspx?iListNum=2&sVal=dogs");

//end AJAX plugin

my_cl_bkmk_app.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

my_cl_bkmk_app.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  //my_cl_bkmk_app.webdb.getAllTodoItems(loadTodoItems);
}
