;(function(window){

    //helper tools
    function extend(obj1, obj2){
        var obj = {};

        for (var key in obj1){
            obj[key] = obj2[key] === undefined ? obj1[key] : obj2[key];
        }

        return obj;
    }

    // defaults
    var defaults = {
        // shuffle: false,
        letterDelay: 300,
        loop: false,
        startOnFocus: true
    };

    function TypingPlaceholder(el, text, options){
        this.el = el;
        this.text = text;
        this.options = extend(defaults, options || {});
        this.timeouts = [];
        this.begin();
    }

    TypingPlaceholder.prototype.begin = function (){
        var self = this;

        self.originalPlaceholder = self.el.getAttribute('placeholder');

        if (self.options.startOnFocus) {
            self.el.addEventListener('focus', function(){
                self.processText(self.text);
            });
            self.el.addEventListener('blur', function(){
                self.cleanUp();
            });
        }else{
            self.processText(self.text);
        }
    }

    TypingPlaceholder.prototype.processText = function (str){
        var self = this,
            timeout;

        for (var i = 0; i < str.length; i++){
            timeout = setTimeout(typingLetterCallback, self.options.letterDelay * i, i);
            self.timeouts.push(timeout);
            console.log(self.timeouts);
        }


        function typingLetterCallback (index){
            console.log(self.text[index]);
            self.el.setAttribute('placeholder', self.text.substr(0, index + 1));
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