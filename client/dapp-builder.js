if (Meteor.isClient) {
    Meteor.startup(function(){
    });

  Template.builder.events({
    'click .button-build': function (event, template) {
        var input = $('.solidityCode').val();
        TemplateVar.set(template, 'state', {isCompiling: true});
        
        if(input == '')
            return TemplateVar.set(template, 'state', {isError: true, error: 'No solidity code'});
        
        try {
            Meteor.call('compile', input, function(err, output){
                
                if(err)
                    return TemplateVar.set(template, 'state', {isError: true, error: err});
                
                if(output.errors)
                    return TemplateVar.set(template, 'state', {isError: true, error: output.errors});
                
                var name = '';
                
                for (var contractName in output.contracts) {
                    name = contractName;
                }
                
                var contract = output.contracts[name];
                    contract.name = contractName;
                    contract.interfaceString = contract.interface.trim();
                    contract.interface = JSON.parse(contract.interface);
                    contract.scriptOpen = '<script type="text/javascript">';
                    contract.scriptClose = '</script>';
                    contract.constructor = {};
                
                _.each(contract.interface, function(method, inputIndex){
                    method.index = inputIndex;
                    
                    if(method.name == contract.name)
                        contract.constructor = method;
                    
                    if(_.has(method, 'inputs') 
                       && method.inputs.length > 0) {
                        
                        _.each(method.inputs, function(input, inputIndex){
                            input.index = inputIndex;
                        });
                        
                        input.hasInputs = true;
                    }

                    if(_.has(method, 'outputs') 
                       && method.outputs.length > 0) {
                        _.each(method.outputs, function(output, outputIndex){
                            input.index = outputIndex;
                        });
                        
                        input.hasOutputs = true;
                    
                    }
                });

                console.log(contract);
                
                TemplateVar.set(template, 'state', {isBuilt: true});
                TemplateVar.set(template, 'contract', contract);
            });
            
            
        }catch(err){
            TemplateVar.set(template, 'state', {isError: true, error: err});   
        }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
