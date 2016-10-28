/**
 * Extracts models, views, and controllers from the AST and the DOM, assuming that the framework being used
 * is EmberJS
 */

/**
 * Extracts the MVC and routing info from the AST object. This is a 
 * helper function to extractMVC, and it assumes the framework used 
 * is EmberJS
 * @param {Object} astObj
 * 			The AST object
 * @param editorInstance
 * 			The index of the editor instance
 */
function extractMVCFromAst_Ember(astObj, editorInstance) {
	var filename = astObj.filename;
	var theAst = astObj.ast;
	
	//Find all instances of CallExpression
	estraverse.traverse(theAst, {
		enter: function(node) {
			//TODO: Perform extraction
		}
	});
}

/**
 * Extracts the MVC info from the DOM object. This is a helper function
 * to extractMVC, and it assumes the framework used is EmberJS. 
 * This method inherently assumes that each HTML file is tied to one 
 * and only one view
 * @param {Object} domObj
 * 			The DOM object
 * @param editorInstance
 * 			The index of the editor instance
 */
function extractMVCFromDom_Ember(domObj, editorInstance) {
	var filename = domObj.filename;
	var theDom = domObj.dom;
	
	//TODO: Perform extraction
}