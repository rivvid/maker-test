var _ = require('underscore');

function prettyLog (level, msg) {
	console.log('----------------------------------------------');
	console[level].call(null,msg);
	console.log('----------------------------------------------');
}

// master list of all components and their dependencies
var components = {};

// list of currently installed components
var installed_components = [];


// declare what additional components a component requires
// params
// 1) the component
// ..splat any dependent components
// sample DEPEND (main, dependent1, dependent2)
function depend () {
	var args = Array.prototype.slice.call(arguments, 0);
	var comp = args.shift();
	components[comp] = {
		dependencies: args
	}
	prettyLog('info','COMPONENT ' + comp + ' DEFINED WITH DEPENDENCIES ' + (args.length ? args.join(', ') : '-NONE-'));
	
}

// get an array of components this component depends on
function _getDependencies (component_name) {
	return components[component_name].dependencies || [];
}

// get a list of components that depend on this component
function _getDependents (component_name) {
	var deps = [];
	_.each(components, function (comp, comp_name) {
		if (comp.dependencies.indexOf(component_name) >= 0) deps.push(comp_name);
	});
	return deps;
}


function _installDependencies (component_name) {
	// get component dependencies, or an empty list
	var deps = _getDependencies(component_name);
	// loop over and install dependencies		
	_.each(deps,function (dep, i) {
		console.info('COMPONENT ' + component_name + ' REQUIRES ' + dep);
		install(dep);
	});
}

// private method that actually installs a single component
function install (component_name) {
	// add to list of components if not already added via depend()
	if (!components[component_name]) depend(component_name);
	
	console.info('TRYING TO INSTALL ' + component_name);
	if (installed_components.indexOf(component_name) == -1) {
		// first install any dependencies...
		_installDependencies(component_name);
		// then install the main component
		installed_components.push(component_name);
		console.info(component_name + ' installed!');
	} else {
		console.error(component_name + ' is already installed!');
	}
}

function remove (component_name) {
	console.log('ATTEMPTING TO REMOVE ' + component_name);
	if (installed_components.indexOf(component_name) == -1) {
		console.log(component_name + ' IS NOT INSTALLED!');
		return false;
	}
	var installed_dependents = [];
	// check to see if any installed apps are dependent on this
	_.each(installed_components, function (comp) {
		var deps = _getDependencies(comp);
		if (deps.indexOf(component_name) >= 0) {
			installed_dependents.push(comp);
		}
	});
	if (installed_dependents.length) {
		console.error('THE FOLLOWING INSTALLED COMPONENTS DEPEND ON ' + component_name + ': ' + installed_dependents.join(', ') + '. PLEASE REMOVE THESE FIRST, THEN REMOVE ' + component_name);
	} else {
		installed_components.splice(installed_components.indexOf(component_name),1);
		console.log('REMOVED ' + component_name);
		// try to uninstall any dependencies
		var deps = _getDependencies(component_name);
		_.each(deps, function (dep) {
			remove(dep);
		});
	}
}

// spit out list of installed components
function list () {
	prettyLog('log', 'INSTALLED COMPONENTS: ' + installed_components.sort().join(', '));
}

function end() {
	prettyLog('log', 'hasta la vista!');
}

depend('TELNET','TCPIP','NETCARD');
depend('TCPIP','NETCARD');
depend('DNS','TCPIP','NETCARD');
depend('BROWSER','TCPIP','HTML');

install('NETCARD');
install('TELNET');
install('foo');
list();

remove('NETCARD');
list();

install('BROWSER');
list();

install('DNS');
list();

remove('TELNET');
list();

remove('NETCARD');
list();

remove('DNS');
list();

remove('NETCARD');
list();

install('NETCARD');
list();

remove('TCPIP');
list();

remove('BROWSER');
list();

remove('TCPIP');
list();


end();