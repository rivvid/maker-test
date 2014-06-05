var _ = require('underscore');

var items = [
	{ id: 1, parent_id: 0, name: 'Inbox' },
	{ id: 2, parent_id: 1, name: 'Favorites' },
	{ id: 3, parent_id: 1, name: 'Priority' },
	{ id: 4, parent_id: 1, name: 'Social' },
	{ id: 5, parent_id: 4, name: 'Facebook' },
	{ id: 6, parent_id: 4, name: 'Twitter' },
	{ id: 7, parent_id: 0, name: 'Trash' },
	{ id: 8, parent_id: 0, name: 'Sent' },
	{ id: 9, parent_id: 8, name: 'Recent' },
	{ id: 10, parent_id: 8, name: 'Archived' }
];

items = _.shuffle(items);

var final = [];
var temp = {};

function findParent (id) {

}

function insertItem (item) {
	item.children = [];
	var parent = item.parent_id;
	if (parent == 0) {
		final.push(item);
	} else {

	}
}

for (var i=0; i<items.length; i++) {
	var item = items[i];
	item.children = [];
	temp[item.parent_id] ? temp[item.parent_id].push(item) : temp[item.parent_id] = [item];
}
var top = temp[0];
console.log(top);
for (var i=0; i<top.length; i++) {
	console.log(findChildren(top[i].id));
}

function findChildren (parent_id) {
	return temp[parent_id] || false;
}


console.log(top);