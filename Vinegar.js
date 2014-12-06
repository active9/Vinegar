/*
 * Vinegar - Javascript <{Template Engine}>
 * @copyright 2014 Active9 LLC.
 * LICENSE: MIT (see LICENSE)
 */

var Vinegar = {

	this: Vinegar,

	/*
	 * templateuri - location of the template file with relative path
	 * datajson - array of data to pass to the template
	 *
	 */
	template: function(obj,datajson) {
		var templatedata;

		/*
		 * Document Body
		 */
		if (obj == document.body || obj == document) {
			templatedata = document.getElementsByTagName("body").innerHTML || document.body.innerHTML;
			obj = document.getElementsByTagName("body") || document.body;
			this.ferment(obj,templatedata,datajson);

		/*
		 * Object Array
		 */
		} else if (obj.length>1) {
			for (var i=0;i<obj.length;i++) {
				templatedata = obj[i].innerHTML;
				this.ferment(obj[i],templatedata,datajson);
			}

		/*
		 * Object
		 */
		} else {
			templatedata = obj.innerHTML;
			this.ferment(obj,templatedata,datajson);
		}
	},

	/* FERMENT - our metabolic process
	 *
	 * templatedata - the template data
	 * datajson - array of data to pass to the template
	 *
	 */
	ferment: function(obj,templatedata,datajson) {
		if (typeof templatedata != "string" || typeof datajson != "object") return;
		if (typeof obj != "object") return;
		if (templatedata.match(/<{*/) || templatedata.match(/&lt;{*/)) {
			templatedata = this.metabolize(obj, templatedata, datajson);
		}
		return templatedata;
	},

	/* METABOLIZE - our metabolistic transformation
	 *
	 */
	metabolize: function(obje,templatedata,datajson) {
		var length = datajson.length;
		var s = 0;
		if(typeof datajson.length == "undefined") {
			datajson = JSON.parse(JSON.stringify(datajson));
			length = this.size(datajson);
			var s = -1;
		}
		for(var i=s;i<length;i++) {
			var obj = datajson[i];
			for(key in obj) {
				if (typeof obj[key] == "object") {
					for(var first in obj[key]) {
						templatedata = this.bond(templatedata, "&lt;{"+key+"}&gt;", first);
						templatedata = templatedata.replace("&lt;{["+key+"]}&gt;", first);
						templatedata = this.bond(templatedata, "<{"+key+"}>", first);
						templatedata = templatedata.replace("<{["+key+"]}>", first);
						templatedata = this.metabolize(obje, templatedata, [obj[key]]);
					}
				} else {
					templatedata = this.bond(templatedata, "&lt;{"+key+"}&gt;", obj[key]);
					templatedata = templatedata.replace("&lt;{["+key+"]}&gt;", obj[key]);
					templatedata = this.bond(templatedata, "<{"+key+"}>", obj[key]);
					templatedata = templatedata.replace("<{["+key+"]}>", obj[key]);
				}
			}
		}
		templatedata = this.ethanol(obje,templatedata);
		return templatedata;
	},

	/*
	 * ETHANOL - mix our templatedata and object
	 */
	ethanol: function(obj,templatedata) {
		if (obj == document.getElementsByTagName("body") || obj == document.body) {
			document.body.innerHTML = templatedata;
		} else {
			obj.innerHTML = templatedata;
		}
		return templatedata;
	},

	/*
	 * BOND - replace our data bonds
	 */
	bond: function(text,replace,with_this) {
		return text.replace(new RegExp(replace, 'g'), with_this);
	},

	/*
	 * SIZE - find an object size
	 */
	size: function(obj) {
		var s = 0;
		for (key in obj) {
			if(typeof obj == "object") s++;
		}
		return s;
	}

}