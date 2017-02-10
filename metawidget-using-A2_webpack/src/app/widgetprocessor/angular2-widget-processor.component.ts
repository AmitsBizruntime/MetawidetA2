import {
    Injectable,
    Compiler,
    ViewContainerRef
} from '@angular/core';

declare var metawidget: any;

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicComponentService } from '../dynamicservice/dynamic.service';

@Injectable()
export class Angular2WidgetProcessor {

    MODEL: string = "model";
    ROOT_COMPONENT_REFERENCE: string = "ref";
    ACTION: string = "actions";

    constructor() { }

    processWidget(widget: HTMLElement, elementName: Object, attributes: Object, mw: any) {
        
        let modelObject = this.ROOT_COMPONENT_REFERENCE + "." + this.MODEL;
        if (mw.path !== undefined) {
            var splitPath = metawidget.util.splitPath(mw.path);
            let modelName = String(splitPath.names);
            while (modelName.search(",") != -1) {
                modelName = modelName.replace(',', '.');
            }
            modelObject += '.' + modelName;
        }
        let model: string;
        if (elementName !== "entity") {
            model = metawidget.util.appendPathWithName( modelObject, attributes );
        }

        let widgetString = widget.outerHTML;
        if (widget.tagName === "INPUT") {
            if (widget.getAttribute("type") === "submit" || widget.getAttribute("type") === "button") {
                let binding = this.ROOT_COMPONENT_REFERENCE + "." + this.ACTION + "." + widget.id + "()";
                widget.setAttribute("on-click", binding);
            } else {
                widget.setAttribute("bindon-ngModel", model);
                widget.setAttribute("on-keyup", "ref.onKeyUp($event)");
                widget.setAttribute("on-keyup.enter", "ref.onEnter($event)");
            }
        } else if (widget.tagName === "SELECT") {
            widget.setAttribute("bindon-ngModel", model);
            let binding = this.ROOT_COMPONENT_REFERENCE + "." + widget.id + "($event)";
            widget.setAttribute("on-change", binding);
        } else if (widget.tagName === "TEXTAREA") {
            widget.setAttribute("bindon-ngModel", model);
        }
        return widget;

    }

}
