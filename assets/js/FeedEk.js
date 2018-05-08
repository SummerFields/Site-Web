/*
* FeedEk jQuery RSS/ATOM Feed Plugin v3.0 with YQL API
* http://jquery-plugins.net/FeedEk/FeedEk.html  https://github.com/enginkizil/FeedEk
* Author : Engin KIZIL http://www.enginkizil.com   
*/

(function ($) {
    $.fn.FeedEk = function (opt) {
        var def = $.extend({
            MaxCount: 5,
            ShowDesc: true,
            ShowPubDate: true,
            DescCharacterLimit: 0,
            LinkTarget: "_blank",
            LinkText: "See on the spot.",
            DateFormat: "",
            DateFormatLang:"en",
            Layout: ['#titleLink','#date','#Desc']
        }, opt);
        
        var id = $(this).attr("id"), i, s = "", dt;
        $("#" + id).empty();
        if (def.FeedUrl == undefined) return;       
        $("#" + id).append('<img src="loader.gif" />');

        var YQLstr = 'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' + def.FeedUrl + '" LIMIT ' + def.MaxCount;

        $.ajax({
            url: "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(YQLstr) + "&format=json&diagnostics=false&callback=?",
            dataType: "json",
            success: function (data) {
                console.log(data);
                $("#" + id).empty();
                if (!(data.query.results.rss instanceof Array)) {
                    data.query.results.rss = [data.query.results.rss];
                }
                $.each(data.query.results.rss, function (e, itm) {
                    
                    if( itm.channel.item.encoded.indexOf('#<span>Summerfields') !== -1 
                     || itm.channel.item.encoded.indexOf('#<span>introductions') !== -1) {
                    
                        s += '<li>';
                        
                        for( l in def.Layout ) {
                            
                            switch(def.Layout[l]) {
                                case '#title' :
                                    s += '<div class="itemTitle">' + itm.channel.item.title + '</div>';
                                break;
                                case '#link' :
                                    s += '<div class="itemTitle"><a href="' + itm.channel.item.link + '" target="' + def.LinkTarget + '" >' + def.LinkText + '</a></div>';
                                break;
                                case '#titleLink' :
                                    s += '<div class="itemTitle"><a href="' + itm.channel.item.link + '" target="' + def.LinkTarget + '" >' + itm.channel.item.title + '</a></div>';
                                break;
                                case '#date' :
                                    dt = new Date(itm.channel.item.pubDate);
                                    s += '<div class="itemDate">';
                                    if ($.trim(def.DateFormat).length > 0) {
                                        try {
                                            moment.lang(def.DateFormatLang);
                                            s += moment(dt).format(def.DateFormat);
                                        }
                                        catch (e){s += dt.toLocaleDateString();}                            
                                    }
                                    else {
                                        s += dt.toLocaleDateString();
                                    }
                                    s += '</div>';
                                break;
                                case '#Desc' :
                                    s += '<div class="itemContent">';
                                    if (def.DescCharacterLimit > 0 && itm.channel.item.encoded.length > def.DescCharacterLimit) {
                                        s += itm.channel.item.description.substring(0, def.DescCharacterLimit) + '...';
                                    } else {
                                        s += itm.channel.item.encoded;
                                    }
                                    
                                    if ( itm.channel.item.enclosure ) {
                                        switch (itm.channel.item.enclosure.type) {
                                            case "image/png" :
                                            case "image/jpeg" :
                                                s += '<img class="itemEnclosure" src="'+itm.channel.item.enclosure.url+'"/>';
                                        }
                                    }
                                     s += '</div>';
                                break;
                            }
                            
                        }
                        s += '</li>';
                        
                    }
                    
                });
                $("#" + id).append('<ul class="feedEkList">' + s + '</ul>');
            }
        });
    };
})(jQuery);
