var Queue = Class.extend({
    
    loadState: 0,
    length: 0,
    item: null,
    
    init: function( list ){
    
        this.length = list.length;
        for(var i = 0 ; i < this.length ; i ++)
            this.stateHidden( list[i] );
        
    },
    
    stateHidden: function( item ) {
        this.state( item );
    },
    
    state: function( item ) {
        this.reply();
    },
    
    reply: function() {
        
        this.replyAction.apply(this, arguments);
        
        this.loadState++;
        if( this.loadState >= this.length )
            this.done();
    },
    
    replyAction: function( item ) {},
    
    done: function() {}

});


var MinecraftAutoPack = Queue.extend({
    
    init: function( version, list ){
    
        this.version = version;
        this.list = list;
        
        this._super( this.list );
        
    },
    
    state: function( item ) {
        var _this = this;
        JSZipUtils.getBinaryContent( item.url, function(err, data){_this.reply( item, err, data)} );
    },
    
    replyAction: function( item, err, data ) {
        
        if(err) throw err;
        item.zip = new JSZip(data);
        
    },
    
    done: function() {
        
        console.log('done');
        console.log(this.list);
        
        // package
        
        var zip = new JSZip();
        
        // list
        for( var i = 0 ; i < this.length ; i++ ) {
            var files = this.list[i].zip.files;
            for( var key in files ) {
                var name = files[key].name;//.split('/');
                //name.shift();
                zip.file(name/*.join('/')*/, files[key]._data);
            }
        }
        
        // pack.mcmeta
        
        var title = [], desc = [], pluriel = this.length > 1 ? 's' : '';
        for( var i = 0 ; i < this.length ; i++ ) {
            title.push(this.list[i].short);
            desc.push(this.list[i].name);
        }
        
        var description = title.join(' - ') +" -- This resource pack contains support for mod"+pluriel+" : "+desc.join(', ');
        var packmcmeta = '{\n\t"pack": {\n\t\t"pack_format": 1,\n\t\t"description": "'+description+'"\n\t}\n}';
        
        console.log(packmcmeta);
        
        zip.file("pack.mcmeta", packmcmeta);
        
        // generate
        var content = zip.generate({type:"blob"});
        saveAs(content, title.join('_')+'_'+this.version+".zip");
        
    }

});




Zepto(function($){
    
    $.ajax({
        type: 'GET',
        url: 'ref.json',
        dataType: 'txt',
        success: function(data){
            var data = $.parseJSON(data);
            
            for( var i = 0, il = data.length ; i < il ; i++ ) {
                
                var vers = data[i];
                var form = $('<form id="form_'+vers.version.split('.').join('-')+'"></form>');
                var fiel = $('<fieldset><legend>'+vers.legend+'</legend></fieldset>');
                var ul = $('<ul/>');
                var input = $('<input name="version" type="hidden" value="'+vers.version+'"/>');
                var button = $('<button id="but_'+vers.version.split('.').join('-')+'" class="variant_'+i+'">Download</button>');
                
                for( var j = 0, jl = vers.variant.length ; j < jl ; j++ ) {
                    
                    var pack = vers.variant[j];
                    var id = '_'+i+'_'+j;
                    var li = $('<li><label form="input'+id+'">'+pack.name+' '+pack.version+'</label><input id="input'+id+'" '+(j==0?'checked="checked"':' ')+'type="checkbox" name="list" value="'+j+'"/></li>');
                    
                    ul.append(li);
                }
                
                fiel.append(ul);
                fiel.append(input);
                fiel.append(button);
                form.append(fiel);
                $('#content').append(form);
                
                //event
                button.on('click', function(e){
                    e.preventDefault();
                    var vt = this.className.split('variant_').join('');
                    var vers = data[vt];
                    
                    var version = this.id.split('but_').join('');
                    var checked = $('#form_'+version+' input[name="list"]:checked');
                    
                    var list = [];
                    for( var j = 0, jl = checked.length ; j < jl ; j++ )
                        list.push( vers.variant[checked[j].value] );
                    
                    new MinecraftAutoPack( vers.version, list );
                    
                });
            }
        }
    });
})


