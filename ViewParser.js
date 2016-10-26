/**
 * Created by Fantasia on 10/26/2016.
 */
/**
 * Created by Misu Be Imp on 6/9/2016.
 */



var modelVariables = [];
var controllerFunctions = [];
var ngRepeatElements = [];

function ModelVariableInView(directive, dataType, modelVariableName) {
    this.directive = directive;
    this.dataType = dataType;
    this.modelVariableName = modelVariableName;

}
function ControllerFunctionInView(directive, dataType, controllerFunctionName) {
    this.directive = directive;
    this.dataType = dataType;
    this.controllerFunctionName = controllerFunctionName;

}
function NG_ReapteElementsInView(arrayName, alice, value) {
    this.arrayName = arrayName;
    this.alice = alice;
    this.value = value;

}

function getHTMLCode() {

    //parse the html into DOM
    var htmlRawCode = document.getElementById('textEditor').value;
    var htmlParser = new DOMParser();
    var parsedDOM = htmlParser.parseFromString(htmlRawCode, "text/html");

    getModelVariables(parsedDOM);
    getControllerFunctions(parsedDOM);
    getNGRepeatElements(parsedDOM);
    getAngularExpressionDirective(htmlRawCode, parsedDOM);


}


function getAngularExpressionDirective(htmlRawCode, parsedDOM) {
    //get all angular Expression {{*}}
    var allAngularExpression = traversDomNodes(parsedDOM, new Array(), parsedDOM);
    for (var i = 0; i < allAngularExpression.length; i++) {
        var element = allAngularExpression[i];
        if (element.indexOf('.')) {
            var dotNotation = "\\" + "\.";
            element = element.replace(/\./g, dotNotation);
        }

        var attributeValueExpression = getAttributeValueRegularExpression(element);
        var tempMatchList;
        while ((tempMatchList = attributeValueExpression.exec(htmlRawCode)) !== null) {
            var attributeValue = tempMatchList[0];
            var array = attributeValue.split("=");
            var attribute = array[0];
            var value = array[1];
            for (var j = 0; j < angularAttributeDirectivesForModelValue.length; j++) {
                var regModelDirective = angularAttributeDirectivesForModelValue[j].signature;
                var matchModelDirective = eval('/' + regModelDirective + '/g');
                if (matchModelDirective.exec(attribute)) {
                    var modelDirective = angularAttributeDirectivesForModelValue[j];
                    var attributeModelValue = value;
                    modelVariables.push(new ModelVariableInView(modelDirective.signature, modelDirective.acceptedDatatype, attributeModelValue));

                }
            }
            for (var k = 0; k < angularAttributeDirectiveForControllerFunctions.length; k++) {
                var regControllerDirective = angularAttributeDirectiveForControllerFunctions[k].signature;
                var matchControllerFunctionDirective = eval('/' + regControllerDirective + '/g');
                if (matchControllerFunctionDirective.exec(attribute)) {
                    var CFDirective = angularAttributeDirectiveForControllerFunctions[k];
                    var attributeCFValue = value;
                    modelVariables.push(new ControllerFunctionInView(CFDirective.signature, CFDirective.acceptedDatatype, attributeCFValue));
                }
            }
        }


    }

}


function getAttributeValueRegularExpression(value) {
    var firstExpression = '/' + 'ng-' + '\\w*="{{(';
    var lastExpression = ')}}"/g'
    var middleValue = value;
    var expression = eval(firstExpression + middleValue + lastExpression);
    return expression;
}

function getNGRepeatElements(parsedDOM) {
    var allNgRepeatElement = parsedDOM.querySelectorAll("[ng-repeat]");
    for (var i = 0; i < allNgRepeatElement.length; i++) {
        element = allNgRepeatElement[i].getAttribute('ng-repeat');
        var ngRepeatExpression = element.split("in");
        var alice = ngRepeatExpression[0].trim();
        var modelVariableArray = ngRepeatExpression[1].trim();
        var ngRepeatElement = traversDomNodes(allNgRepeatElement[i], new Array(), allNgRepeatElement[i]);
        for (var l = 0; l < ngRepeatElement.length; l++) {
            //replace
            var replacedElement = ngRepeatElement[l].replace(alice, modelVariableArray);
            ngRepeatElements.push(new NG_ReapteElementsInView(modelVariableArray, alice, replacedElement));
        }
    }

}

function getModelVariables(parsedDOM) {
    for (var i = 0; i < angularAttributeDirectivesForModelValue.length; i++) {
        var directive = angularAttributeDirectivesForModelValue[i];
        var elements = parsedDOM.querySelectorAll('[' + directive.signature + ']');

        if (elements != null && elements.length > 0) {
            for (var j = 0; j < elements.length; j++) {
                var directiveAttributeModelValue = elements[j].getAttribute(directive.signature);
                modelVariables.push(new ModelVariableInView(directive.signature, directive.acceptedDatatype, directiveAttributeModelValue.replace(/{{/g, '').replace(/}}/g, '').trim()));

            }
        }
    }

}

function getControllerFunctions(parsedDOM) {
    for (var i = 0; i < angularAttributeDirectiveForControllerFunctions.length; i++) {
        var directiveCF = angularAttributeDirectiveForControllerFunctions[i];
        var elements = parsedDOM.querySelectorAll('[' + directiveCF.signature + ']');
        if (elements != null && elements.length > 0) {
            for (var j = 0; j < elements.length; j++) {
                var directiveAttributeControllerFunctionValue = elements[j].getAttribute(directiveCF.signature);

                controllerFunctions.push(new ControllerFunctionInView(directiveCF.signature, directiveCF.acceptedDatatype, directiveAttributeControllerFunctionValue));

            }
        }
    }

}

function traversDomNodes(node, modelVariableList, theDom) {

    if (node.nodeType == 9) { //DOCUMENT node
        for (var i = 0; i < node.childNodes.length; i++) {
            traversDomNodes(node.childNodes[i], modelVariableList, theDom);
        }
    }
    else if (node.nodeType == 3) { //TEXT node
        var angularExpression = /{{(.*)+}}/g;//angular expression pattern {{xyz}}
        var textNodeData = node.data;
        var tempMatchList;
        while ((tempMatchList = angularExpression.exec(textNodeData)) !== null) {
            var replaced = tempMatchList[0].replace(/{{/g, '').replace(/}}/g, '').trim();
            modelVariableList.push(replaced);

        }
    }
    else if (node.nodeType == 1) { //ELEMENT node
        for (var i = 0; i < node.childNodes.length; i++) {
            traversDomNodes(node.childNodes[i], modelVariableList, theDom);
        }
    }
    return modelVariableList;
}



