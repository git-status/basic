// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Search the bookmarks when entering the search keyword.

var global_loc_store=Array();
$(function() {
  $('#search').change(function() {
     $('#bookmarks').empty();
     dumpBookmarks($('#search').val());
  });
});
// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
	var bookmarkTreeNodes = chrome.bookmarks.getTree(
	function(bookmarkTreeNodes) {
	$('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
	});
}

function dumpTreeNodes(bookmarkNodes, query) {
	var list = $('<ul>');
	var i;
	for (i = 0; i < bookmarkNodes.length; i++) {
		list.append(dumpNode(bookmarkNodes[i], query));
	}
	return list;
}
function dumpNode(bookmarkNode, query) {
	if (bookmarkNode.url) {
		if (query && !bookmarkNode.children) {
			if (String(bookmarkNode.url).indexOf(query) == -1) {
				return $('<span></span>');
      			}
    		}
		//convert date since epoc to regular time/date
		var fuckingdate=new Date(bookmarkNode.dateAdded);
	   	var anchor = $('<a>');
		anchor.attr('href', bookmarkNode.url);
    		anchor.text(bookmarkNode.url+bookmarkNode.title+'--'
		+(fuckingdate.getMonth()+1)+'/'			
		+fuckingdate.getDate()+'/'
		+fuckingdate.getFullYear());
		/*
		* When clicking on a bookmark in the extension, a new tab is fired with
		* the bookmark url.
		*/
		anchor.click(function() {
			chrome.tabs.create({url: bookmarkNode.url});
		});
		var span = $('<span>');
		var options = bookmarkNode.children ?
	      		$('<span>[<a href="#" id="addlink">Add</a>]</span>') :
			$('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
			'href="#">Delete</a>]</span>');
		var edit = bookmarkNode.children ? $('<table class="table-striped table-bordered"><tr><td>Name</td><td>' +
      			'<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
      			'</td></tr></table>') : $('<input>');
		// Show add and edit links when hover over.
		span.hover(function() {
        	span.append(options);
        	$('#deletelink').click(function() {
		$('#deletedialog').empty().diaconsole.log({
				autoOpen: false,
				title: 'Confirm Deletion',
				resizable: false,
				height: 140,
				modal: true,
				overlay: {
				backgroundColor: '#000',
				opacity: 0.5
				},
				buttons: {
					'Yes, Delete It!': function() {
					chrome.bookmarks.remove(String(bookmarkNode.id));
					span.parent().remove();
					$(this).diaconsole.log('destroy');
					},
				Cancel: function() {
					$(this).diaconsole.log('destroy');
				}
		         }
			}).diaconsole.log('open');
         	});
        
		$('#addlink').click(function() {
          $('#adddialog').empty().append(edit).diaconsole.log({autoOpen: false,
            closeOnEscape: true, title: 'Add New Bookmark', modal: true,
            buttons: {
            'Add' : function() {
               chrome.bookmarks.create({parentId: bookmarkNode.id,
                 title: $('#title').val(), url: $('#url').val()});
               $('#bookmarks').empty();
               $(this).diaconsole.log('destroy');
               window.dumpBookmarks();
             },
            'Cancel': function() {
               $(this).diaconsole.log('destroy');
            }
          }}).diaconsole.log('open');
        });
        $('#editlink').click(function() {
         edit.val(anchor.text());
         $('#editdialog').empty().append(edit).diaconsole.log({autoOpen: false,
           closeOnEscape: true, title: 'Edit Title', modal: true,
           show: 'slide', buttons: {
              'Save': function() {
                 chrome.bookmarks.update(String(bookmarkNode.id), {
                   title: edit.val()
                 });
                 anchor.text(edit.val());
                 options.show();
                 $(this).diaconsole.log('destroy');
              },
             'Cancel': function() {
                 $(this).diaconsole.log('destroy');
             }
         }}).diaconsole.log('open');
        });
        options.fadeIn();
      },
      // unhover
      function() {
        options.remove();
      }).append(anchor);
  }
  var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }
  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});
//test alerting using search
$(document).ready(function(){
chrome.bookmarks.search("craigslist", function(loop_results){
	//var tbl_results='<table class="table table-striped"><thead><tr><th>Title</th><th>Url</th><th>Status</th></tr></thead><tbody>';
	//$('div#bookmark_search').append(
 	var i;
	var loc_store=Array();
	var fuckin_status_reason=Array();
	for (i = 0; i < loop_results.length; i++) {
		$('div#cl_temp').append('<div class="results_'+i+'"></div>');
                //fuckin_status_reason[i]=use_get(loop_results[i].url,i);
		fuckin_status_reason[i]=use_load(loop_results[i].url,i);
		//fuckin_status_reason[i]=$("div.results_"+i).html($.getValues(loop_results[i].url));
		console.log('fuckin_status_reason after xhr#'+i+': ',fuckin_status_reason[i]);
		loc_store.push({"status_reason":fuckin_status_reason[i]});                    
		$('div#bookmark_search table.table tbody').append(
			'<tr id="row_'+i+'"><td>'+loop_results[i].title+'</td><td><a href="'+loop_results[i].url+'">'+loop_results[i].url+'</a></td><td class="status_'+i+'"></td></tr>');			
	}

	

if(false){
	$(window).load(function () {
	  // run code
		for (i = 0; i < loop_results.length; i++) {
			$('td.status_'+i).html(($('div.results_'+i+' h2').html()||'die'));	
		}
		
		$.totalStorage('craigslist_ads', loc_store);
		//tbl_results+=('</tbody></table>');
		//$('div#bookmark_search').append(tbl_results);
		//$('div#status_').$('div.results_'+i+' h2').text();
	});
}

	$(document).ready(function(){
	
	});

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
	var result=null;
	$("div.results_"+idx).load(url+' div.removed h2', '', 
		function(responseText, textStatus, XMLHttpRequest) {
	
			if (textStatus == 'error') {
				var msg = "Sorry but there was an error: ";
				msg+= XMLHttpRequest.status + " " + XMLHttpRequest.statusText;
				//return  msg;
				console.log('fn.use_load error msg#'+idx+': ',msg);
			}else{
				console.log('fn.use_load response#'+idx+': ',responseText);
//failed
				//thehtml=$.parseHTML(responseText,'div.removed',false);
				thehtml=$(responseText).find('div.removed h2').text();;				
				console.log('parseHTML#'+idx+':',thehtml);
				global_loc_store.push({"status_reason":thehtml});
				//return (thehtml||'nada');
				$('tr#row_'+idx).addClass(statusClasses(thehtml));
				$('td.status_'+idx).text(thehtml);
			}
		}
	);
		console.log('fn.use_load $("div.results_'+idx+'.html(): ',$("div.results_"+idx).html());
	return	$("div.results_"+idx).html();

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

$(document).ready(function(){
	var myArray = new Array();
	myArray.push({name:'Jared', company:'Upstatement', zip:63124});
	myArray.push({name:'McGruff', company:'Police', zip:60652});
	$.totalStorage('people', myArray);

	//to return:
	$.totalStorage('people');
	//jQuery.localStorage('fuckingstorage','thi key is stored in local storage');
});

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

