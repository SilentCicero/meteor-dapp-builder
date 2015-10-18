if(Meteor.isServer){
    Meteor.methods({
        compile: function(input){
            return solc.compile(input, 1);
        },
    });
}