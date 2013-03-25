// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Search the bookmarks when entering the search keyword.
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
//	fuckingdate.setMilliseconds(bookmarkNode.dateAdded);
	//nodeMonth
	//nodeDay
	//nodeYear
	
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
          $('#deletedialog').empty().dialog({
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
                      $(this).dialog('destroy');
                    },
                    Cancel: function() {
                      $(this).dialog('destroy');
                    }
                 }
               }).dialog('open');
         });
        $('#addlink').click(function() {
          $('#adddialog').empty().append(edit).dialog({autoOpen: false,
            closeOnEscape: true, title: 'Add New Bookmark', modal: true,
            buttons: {
            'Add' : function() {
               chrome.bookmarks.create({parentId: bookmarkNode.id,
                 title: $('#title').val(), url: $('#url').val()});
               $('#bookmarks').empty();
               $(this).dialog('destroy');
               window.dumpBookmarks();
             },
            'Cancel': function() {
               $(this).dialog('destroy');
            }
          }}).dialog('open');
        });
        $('#editlink').click(function() {
         edit.val(anchor.text());
         $('#editdialog').empty().append(edit).dialog({autoOpen: false,
           closeOnEscape: true, title: 'Edit Title', modal: true,
           show: 'slide', buttons: {
              'Save': function() {
                 chrome.bookmarks.update(String(bookmarkNode.id), {
                   title: edit.val()
                 });
                 anchor.text(edit.val());
                 options.show();
                 $(this).dialog('destroy');
              },
             'Cancel': function() {
                 $(this).dialog('destroy');
             }
         }}).dialog('open');
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
chrome.bookmarks.search("craigslist", function(loop_results){
	var tbl_results='<table class="table table-striped"><thead><tr><th>Title</th><th>Url</th><th>Status</th></tr></thead><tbody>';

 	var i;
	var loc_store=Array();


	//loc_store.push({name:'Jared', company:'Upstatement', zip:63124});
	//loc_store.push({name:'McGruff', company:'Police', zip:60652});
	
	fuckin_status_reason=Array();

	  for (i = 0; i < loop_results.length; i++) {
			//loc_store[i]=$().load(loop_results[i].url+' div.removed');
		$('div#cl_temp').append('<div class="results_'+i+'"></div>');
                fuckin_status_reason[]=$("div.results_"+i).load(loop_results[i].url+' div.removed h2', '', function(response, status, xhr) {
			if (status == 'error') {
				        var msg = "Sorry but there was an error: ";
				        $(".content").html(msg + xhr.status + " " + xhr.statusText);
				    }
                }).html();
		//this fucking works ...alert($("div.results_42 h2").html());
		//loc_store.push($("div.results_"+i+" h2").html());
		 fuckin_status_reason[i]=($("div.results_"+i.toString()+" h2").text()||'available');
		loc_store.push({"status_reason":fuckin_status_reason[i]});                    

			tbl_results+=('<tr><td>'+loop_results[i].title+'</td><td><a href="'+loop_results[i].url+'">'+loop_results[i].url+'</a></td><td>'+status_text(loc_store[i])+'</td></tr>');			


			
		}
		$.totalStorage('craigslist_ads', loc_store);
		tbl_results+=('</tbody></table>');
		$('div#bookmark_search').append(tbl_results);

});

function status_text(stat_string_html){
	return;
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

$(document).ready(function(){

	var myArray = new Array();
	myArray.push({name:'Jared', company:'Upstatement', zip:63124});
	myArray.push({name:'McGruff', company:'Police', zip:60652});
	$.totalStorage('people', myArray);

	//to return:
	$.totalStorage('people');
	//jQuery.localStorage('fuckingstorage','thi key is stored in local storage');
});

