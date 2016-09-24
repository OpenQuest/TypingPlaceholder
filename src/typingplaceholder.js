;(function(window){

    //helper tools
    function extend(obj1, obj2){
        var obj = {};

        for (var key in obj1){
            obj[key] = obj2[key] === undefined ? obj1[key] : obj2[key];
        }

        return obj;
    }

    function isArray(arr){
        return toString.apply(arr) === '[object Array]';
    }

    // defaults
    var defaults = {
        letterDelay: 100, //milliseconds
        sentenceDelay: 1000, //milliseconds
        loop: false,
        startOnFocus: true,
        shuffle: false,
        showCursor: true,
        cursor: '|'
    };

    function TypingPlaceholder(el, texts, options){
        this.el = el;
        this.texts = texts;
        this.options = extend(defaults, options || {});
        this.timeouts = [];
        this.begin();
    }

    TypingPlaceholder.prototype.begin = function (){
        var self = this;

        if (! isArray(self.texts)) {
            throw new Error('The "texts" property of options must be an Array');
        }

        self.originalPlaceholder = self.el.getAttribute('placeholder');

        if (self.options.startOnFocus) {
            self.el.addEventListener('focus', function(){
                self.processText(0);
            });
            self.el.addEventListener('blur', function(){
                self.cleanUp();
            });
        }else{
            self.processText(0);
        }
    }

    TypingPlaceholder.prototype.processText = function (index){
        var self = this,
            timeout;

        self.typingString(self.texts[index], function(){
            console.info('done');
            self.timeouts = [];

            timeout = setTimeout(function(){
                var nextIndex = self.options.loop ? ((index+1) % self.texts.length) : (index+1);
                self.processText(nextIndex);
            }, self.options.sentenceDelay);

            self.timeouts.push(timeout);
        });
    }

    TypingPlaceholder.prototype.typingString = function(str, callback){
        var self = this,
            timeout;

        if (!str) {return false;}

        for (var i = 0; i < str.length; i++){
            timeout = setTimeout(typingLetterCallback, self.options.letterDelay * i, i);
            self.timeouts.push(timeout);
            console.log(self.timeouts);
        }


        function typingLetterCallback (index){
            self.el.setAttribute('placeholder', str.substr(0, index + 1) +(!self.options.showCursor || index===str.length - 1 ? '': self.options.cursor));
            if(index == str.length - 1){
                callback();
            }
        }
    }
    TypingPlaceholder.prototype.cleanUp = function(){
        var self = this;

        for (var i = 0; i < self.timeouts.length; i++) {
            clearTimeout(self.timeouts[i]);
        }

        self.el.setAttribute('placeholder', self.originalPlaceholder);
        self.timeouts.length = 0;
    }
    window.TypingPlaceholder = TypingPlaceholder;

})(window);