function addLink(href) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('link');
    style.type = 'text/css';
    style.rel = "stylesheet";
    style.href = href;
    head.appendChild(style);
}
addLink('http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/css/bootstrap.min.css');

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.OUTFOX_NANCI_TIPS {color: #008000;}.OUTFOX_NANCI_WRAPPER {color: #F00;}#newwordTable .word{color: red;}#newwordTable{width: 960px;margin: 0 auto;z-index: 1000;}#newwordTable .sentence b{color: green;}');

var _bodyMarginTop;
function activeYDictBookmarklet() {
    if(!$('#OUTFOX_BAR_WRAPPER').length) {
        void((function() {var element = document.createElement('script');element.id = 'outfox_seed_js';element.charset = 'utf-8',element.setAttribute('src', 'http://fanyi.youdao.com/web2/seed.js?' + Date.parse(new Date()));document.body.appendChild(element);})())
        return;
    }
    if($('#OUTFOX_BAR_WRAPPER').css('display') === 'none') {
        $('#OUTFOX_BAR_WRAPPER').show();
        $('body').css('marginTop',bodyMarginTop);
    } else {
        bodyMarginTop = $('body').css('marginTop');
        $('body').css('marginTop','');
        $('#OUTFOX_BAR_WRAPPER').hide();
    }
}
key('d', activeYDictBookmarklet);

key('t', activeNewWordTable);

function activeNewWordTable(){
    if(!$('#newwordTable').length) {
        var hasExtractWords = [];
        function extractWordSentence ($word) {
            $word = $($word);
            var paraStr = $word.parent().text();
            var wordStr = $word.text();
            if(hasExtractWords.indexOf(wordStr) > -1) {
                return;
            }
            hasExtractWords.push(wordStr);
            var a = eval('/[^“.!?]*?WORD\\([^“.!?]*/'.replace('WORD',wordStr));
            // console.log(a.exec(paraStr)[0].replace(/\n/g,'').replace(/\s{2,}/g,''));
            return {
                word: wordStr,
                sentence: a.exec(paraStr)[0].replace(/\n/g,'').replace(/\s{2,}/g,'').replace(wordStr, '<b>'+wordStr+'</b>')
            }
            // todo- annote current word using font[color=red] etc
        }

        var extractedDict = _.map($('.OUTFOX_NANCI_WRAPPER'), function(w) {
            return extractWordSentence(w);
        });

        extractedDict = _.filter(extractedDict, function(i) {
            if(i) {
                return i;
            }
        });

        var TrList = "<% _.each(extractedDict, function(i) { %> <tr><td class='word'><%= i.word %></td><td class='sentence'><%= i.sentence %></td></tr> <% }); %>";

        var wordSentenceTableHtml = _.template(TrList, {extractedDict: extractedDict});

        // $('body').html($('<table />').html(wordSentenceTableHtml).html())
        $('<table class="table" id="newwordTable" />').html('<tbody>'+wordSentenceTableHtml+'</tbody>').prependTo('body');
        return;
    }
    if($('#newwordTable').css('display') === 'none') {
        $('#newwordTable').show();
    } else {
        $('#newwordTable').hide();
    }
}