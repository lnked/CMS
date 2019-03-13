var category, controls;

function doOnLoad(path)
{
	category = new dhtmlXTreeObject("treeboxbox_tree", "100%", "100%", 0);
	category.setImagePath('/' + ADMIN_DIR + '/images/tree/');
	category.enableDragAndDrop(true);
	category.setEditStartAction(true/false);
	category.enableKeyboardNavigation(true);
	category.enableMultiselection(true);
	category.enableTreeLines(true);
	category.makeAllDraggable();
	
	/*
	category.enableCheckBoxes(true);
	*/
	
	category.attachEvent("onDrop", function(sId, tId, id, sObject, tObject){
		$.ajax({
            url: '/' + ADMIN_DIR + '/' + path + '/updateStructure',
            type: "post",
            data: {
            	oid: sId,
            	pid: tId
            }
       	});
	});

	category.attachEvent("onDblClick", function(id){
	    
	});
}

function controlLink(path, page, type, id, attribute)
{
	switch(type)
	{
		case 'add':
			return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/add/' + id + '" class="control-icon icon icon-file-plus" title="Добавить подраздел" data-no-instant></a>';
		break;

		case 'edit':
			return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/edit/' + id + '" class="control-icon icon icon-edit" title="Редактировать раздел" data-no-instant></a>';
		break;

		case 'visible':
			return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/visible/' + id + '" class="control-icon icon icon-eye' + (attribute == 0 ? '-off' : '') + '" onclick="ajax_vis_toggle(this, 15, 0); return false;" title="Отображение страницы" data-no-instant></a>';
		break;

		case 'delete':
			return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/del/' + id + '" class="control-icon icon icon-delete" title="Удалить раздел" onclick="return cp.dialog(\'Вы действительно хотите удалить раздел?\');" data-no-instant></a>';
		break;
	}
}

function buildTree(path, page)
{
	$.ajax({
        url: '/' + ADMIN_DIR + '/' + path + '/getStructure',
        type: "get",
        dataType: "JSON",
        success: function(response)
        {
        	category.deleteChildItems(0);
			
        	if (response.length)
        	{
            	for(var x in response)
            	{
            		controls = '';

            		controls += '<span class="control-icons">';
            		controls += controlLink(path, page, 'add', response[x].id);
            		controls += controlLink(path, page, 'edit', response[x].id);
            		controls += controlLink(path, page, 'visible', response[x].id, response[x].visible);
            		controls += controlLink(path, page, 'delete', response[x].id);
            		controls += '</span>';

            		close = 0;
            		open = 0;
            		leaf = 0;

            		if (response[x].pid == 0)
            		{
            			leaf = 'icon/home.svg';
            			open = 'icon/home.svg';
            			close = 'icon/home.svg';
            		}
            		else if (response[x].dynamic == 1)
            		{
						leaf = 'icon/application-code.svg';
            		}
            		else {
            			leaf = 'icon/file.svg';
            		}

            		category.insertNewChild(response[x].pid, response[x].id, response[x].name + ' ' + controls, 0, leaf, open, close);
            	}
        	}
			
        	category.openOnItemAdding(true);
        }
   	});
}