import { Component, ViewChild, QueryList, ViewContainerRef, ElementRef, Compiler, OnInit, Renderer } from '@angular/core';
import { MetawidgetComponent } from './metawidget/metawidget.component';

declare var metawidget: any;

@Component({
	selector: 'my-app',
	template: require('./app.component.html')
})
export class AppComponent implements OnInit {

	/*@ViewChild(MetawidgetComponent)
	mw: QueryList<MetawidgetComponent>;*/
	@ViewChild('meta1')
	mw1: MetawidgetComponent;
	@ViewChild('meta2')
	mw2: MetawidgetComponent;

	@ViewChild('metawidget', { read: ViewContainerRef })
	metawidgetVCRef: ViewContainerRef;
	metWidgetCompRef: any;

	constructor() {
	}

	ngOnInit() {
		//alert(this.mw2);
		this.mw1.rootComponentReference = this;
		this.mw2.rootComponentReference = this;
		//console.log(this.mw.first);
	}

	designation(event: any) {
		alert("Change Event: " + event.target.value);
	}

	onKeyUp(event: any) {
		console.log( event.target.value );
	}

	onEnter(event: any) {
		console.log( "Enter Event Occur: " + event.target.value );
	}

	actions = {
		save: function() {
			alert("Save");
		},
		delete: function() {
			alert("Delete");
		},
		edit: function() {
			alert("Edit");
		},
		remove: function() {
			alert("Remove");
		}
	}

	model = {
		firstName: "John",
		lastName: "Doe",
		age: 28,
		"address": {
			city: "NY",
			country: "US",
		},
		email: 'john@abc.com',
		"designation": "Full Stack Developer"
	};

	schemaConfiguration: Object = {
		"type": "object",
		"properties": {
			"firstName": {
				"type": "string",
			},
			"lastName": {
				"type": "string"
			},
			"age": {
				"type": "integer"
			},
			"address": {
				"type": "object",
				"properties": {
					"city": {
						"type": "string"
					},
					"country": {
						"type": "string"
					}
				}
			},
			"email": {
				"type": "string"
			},
			"designation": {
				"enum": ['Software Developer', 'System Admin', 'Full Stack Developer']
			}
		}
	};

	config: Object = {
		inspector: new metawidget.inspector.JsonSchemaInspector(this.schemaConfiguration)
	};

}