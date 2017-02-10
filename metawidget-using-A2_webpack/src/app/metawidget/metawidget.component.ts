import {
    Component,
    Input,
    ElementRef,
    OnInit,
    ViewContainerRef,
    Compiler,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Angular2WidgetProcessor } from '../widgetprocessor/angular2-widget-processor.component';
import { DynamicComponentService } from '../dynamicservice/dynamic.service';
import { AppComponent } from '../app.component';

declare var metawidget: any;
declare var $: any;

@Component({
    selector: 'metawidget',
    template: ''
})
export class MetawidgetComponent implements OnInit {

    @Input()
    config: Object;
    @Input()
    model: any;
    elem: Element;
    _pipeline: any;
    path: string;
    rootComponentReference: any;

    constructor(public element: ElementRef, public compiler: Compiler, public vcRef: ViewContainerRef) {
        this.elem = element.nativeElement;
    }

    ngOnInit() {
        if( this.model === undefined ) {
            this.model = {};
        }
        metaWidgetConfiguration(this.elem, this.config, this, this.vcRef, this.compiler, this.rootComponentReference, this.model);
    }

    clearWidgets() {
        let element = this.getElement();
        while (element.childNodes.length > 0) {
            element.removeChild(element.childNodes[0]);
        }
    }

    overriddenNodes() {

    }

    buildNestedMetawidget(attributes: any, config: any) {
        if( this.model[attributes.name] === undefined ) {
            this.model[attributes.name] = {};
        }
        var nestedWidget = metawidget.util.createElement( this, 'div' );
        var nestedMetawidget = new metawidget.Metawidget(nestedWidget, [this._pipeline, config]);
        nestedMetawidget.path = metawidget.util.appendPath(attributes, this);
        nestedMetawidget.buildWidgets();
        return nestedWidget;
    }

    getElement() {
        return this.elem;
    }

}

export function metaWidgetConfiguration(elem: Object, config: Object, reference: any, vcRef: ViewContainerRef, compiler: Compiler, compRef: any, model: any) {

    let pipeline = new metawidget.Pipeline(elem);
    pipeline._superLayoutWidget = pipeline.layoutWidget;
    pipeline.layoutWidget = function (widget: any, elementName: Object, attributes: Object, container: HTMLElement, mw: any) {
        if (widget.overridden === undefined) {
            let dynamicService = new DynamicComponentService(compiler);
            widget = dynamicService.getDOMElementOfDynamicTemplate(widget, vcRef, compRef);
            widget = widget.firstChild;
        }
        pipeline._superLayoutWidget.call(this, widget, elementName, attributes, container, mw);
    }
    pipeline.inspector = new metawidget.inspector.PropertyTypeInspector();
    pipeline.widgetBuilder = new metawidget.widgetbuilder.CompositeWidgetBuilder([
        new metawidget.widgetbuilder.OverriddenWidgetBuilder(),
        new metawidget.widgetbuilder.ReadOnlyWidgetBuilder(),
        new metawidget.widgetbuilder.HtmlWidgetBuilder()]);
    pipeline.widgetProcessors = [
        new metawidget.widgetprocessor.IdProcessor(),
        new metawidget.widgetprocessor.PlaceholderAttributeProcessor(),
        new metawidget.widgetprocessor.DisabledAttributeProcessor(),
        new metawidget.widgetprocessor.SimpleBindingProcessor(),
        new Angular2WidgetProcessor()];
    pipeline.layout = new metawidget.layout.HeadingTagLayoutDecorator(
        new metawidget.layout.TableLayout({ numberOfColumns: 1 }));
    if( config !== undefined ) {
        pipeline.configure(config);
        reference._pipeline = pipeline;
        pipeline.buildWidgets(pipeline.inspect(), reference);
    } else {
        reference._pipeline = pipeline;
        var splitPath = metawidget.util.splitPath( "model" );
        let inspectionResult = pipeline.inspect(model, splitPath.type, splitPath.names, reference);
        pipeline.buildWidgets(inspectionResult, reference);
    }
    
}