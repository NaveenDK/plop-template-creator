//import {trimRight, isEmpty} from 'lodash.js'
var trimRight = require('lodash');
var isEmpty= require('lodash');

const modulePath =  "app/modules/{{camelCase name}}.js";

const ensurePlural = ( text ) => trimRight( text, "s" ) + "s";

const isNotEmptyFor = ( name ) => {
  return ( value ) => {
    if ( isEmpty( value ) ) return name + " is required";
    return true;
  }
}


module.exports = ( plop ) => {
  
    // We declare a new generator called "module"
    plop.setGenerator( "module", {
  
      // Succintly describes what generator does.
      description: "Create a new module",
  
      // Get inputs from the user.
      // That's Inquirer.js doing the job behind the hood.
      prompts: [
        {
          type: "input",
          name: "name",
          message: "What is your module name?",
       //   validate: isNotEmptyFor( "name" ),
          filter: ensurePlural
        }
      ],
  
      // List of actions to take.
      // Here we "add" new files from our templates.


      actions: [
        // Add a new model + tests boilerplate.
        {
          type: "add",
          path: "app/modules/{{camelCase name}}.model.js",
          templateFile: "plop-templates/model.js"
        },
        {
          type: "add",
          path: "app/tests/{{camelCase name}}.model.tests.js",
          templateFile: "plop-templates/model.tests.js"
        },

        // Modify the module file to inject created model.
        // This is basically RegExp replacement.
        {
          type: "modify",
          path: modulePath,
          pattern: /(\/\/ IMPORT MODULE FILES)/g,
          template: "$1\nimport Model from \"./{{camelCase name}}.model\";"
        },
        {
          type: "modify",
          path: modulePath,
          pattern: /(const namespace = "\w+";)/g,
          template: "$1\n\nModel = Model.extend( { namespace: namespace } );"
        }
    ]



  
    } );
  
  };
  