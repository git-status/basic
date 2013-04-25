// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Search the bookmarks when entering the search keyword.

var global_loc_store=new Array();
//test alerting using search
$(document).ready(function(){

console.log('starting this fucker','fuckyou');
var dfd = $.Deferred();
dfd.done(chrome.bookmarks.search("craigslist", function(loop_results){
	var existing_loc_stor=$.totalStorage('craigslist_ads_again1');
 	var i;
	var loc_store=Array();
	var fuckin_status_reason=Array();
	for (i = 0; i < loop_results.length; i++) {
		$('div#cl_temp').append('<div class="results_'+i+'"></div>');
                //fuckin_status_reason[i]=use_get(loop_results[i].url,i);
		//fuckin_status_reason[i]=$("div.results_"+i).html($.getValues(loop_results[i].url));
		console.log('initiating load#'+i+':',loop_results[i].url);                    
		$('div#bookmark_search table.table tbody').append(
			'<tr id="row_'+i+'"><td>'+loop_results[i].title+'</td><td><a href="'+loop_results[i].url+'">'+loop_results[i].url+'</a></td><td class="status_'+i+'"></td></tr>');			
			if(existing_loc_stor[i]==null){	
			//create initial values for ajax callback to append to..
			this_bmk=new Array({index:i,"url":loop_results[i].url,"title":loop_results[i].url});	
			global_loc_store.push(this_bmk);
			$.totalStorage('craigslist_ads_again1', this_bmk);
		}else{
			//just a status check update to be completed in ajax callback		
		}
	
		fuckin_status_reason[i]=use_load(loop_results[i].url,i);
		loc_store.push({"status_reason":fuckin_status_reason[i]});
	}


}

)





).done(load_llocal());

});
//$.totalStorage('craigslist_ads_again1', this_bmk);
var fn_loop_results=function(loop_results){

 	var i;
	var existing_loc_stor=$.totalStorage('craigslist_ads_again1');
	var loc_store=Array();
	var fuckin_status_reason=Array();
	for (i = 0; i < loop_results.length; i++) {
		$('div#cl_temp').append('<div class="results_'+i+'"></div>');
                //fuckin_status_reason[i]=use_get(loop_results[i].url,i);
		//fuckin_status_reason[i]=$("div.results_"+i).html($.getValues(loop_results[i].url));
		console.log('initiating load#'+i+':',loop_results[i].url);                    
		$('div#bookmark_search table.table tbody').append(
			'<tr id="row_'+i+'"><td>'+loop_results[i].title+'</td><td><a href="'+loop_results[i].url+'">'+loop_results[i].url+'</a></td><td class="status_'+i+'"></td></tr>');		
		
		if(existing_loc_stor[i]==null){
			console.log('Init local db for this bookmark.');	
			//create initial values for ajax callback to append to..
			this_bmk=new Array({index:i,"url":loop_results[i].url,"title":loop_results[i].url, "status_reason":"unknown"});	
			global_loc_store.push(this_bmk);
			$.totalStorage('craigslist_ads_again1', this_bmk);
		}else{
			//just a status check update to be completed in ajax callback
			console.log('Updating local db {status_reason} for this bookmark.');		
		}
		
		
		fuckin_status_reason[i]=use_load(loop_results[i].url,i);
		loc_store.push({"status_reason":fuckin_status_reason[i]});
	}


}

function load_llocal(){

	console.log('.totalstorage global running');
	global_fuck=new Array();
	for (i = 0; i < global_loc_store.length; i++) {
		global_fuck.push({name:'Jared', company:'Upstatement', zip:63124});
		console.log('reason',global_loc_store[i]);
	}
	$.totalStorage('craigslist_ads_again1', global_fuck);
	//$.totalStorage('craigslist_ads', loc_store);
	//tbl_results+=('</tbody></table>');
	//$('div#bookmark_search').append(tbl_results);
	//$('div#status_').$('div.results_'+i+' h2').text();

}

$(document).ready(function(){
$(window).load(function () {
  // run code
	
});

});

function status_text(stat_string_html){
	return "fucked";
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

function use_load(url,idx){
	var locyo=$.totalStorage("craigslist_ads_again1");
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
				if (locyo[idx]!=null){
					console.log('fn.use_load response#'+idx+': ',responseText);
					thehtml=$(responseText).find('div.removed h2').text();;				
					console.log('find()#'+idx+':',thehtml);
					this_stat={"status_reason":(thehtml||"available")};
					locyo[idx].push(this_stat);
					$.totalStorage('craigslist_ads_again1', locyo[idx]);
					console.log('#'+idx+') global_loc_store.length',global_loc_store.length);
					$('tr#row_'+idx).addClass(statusClasses(thehtml));
					$('td.status_'+idx).text(thehtml);
					msg=thehtml;
				}else{
					console.log('fn.use_load wtf');		
					
				}
				
			}
			return msg;
		}
	);

}

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

