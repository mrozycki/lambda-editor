var $editor = $('#editor');

function getKeyName(e) {
  var keyboardMap = ["","","","Cancel","","","Help","","Backspace","Tab","","","Clear","Enter","Return","","Shift","Control","Alt","Pause","CapsLock","Kana","Eisu","Junja","Final","Hanja","","Escape","Convert","NonConvert","Accept","ModeChange"," ","PageUp","PageDown","End","Home","ArrowLeft","ArrowUp","ArrowRight","ArrowDown","Select","Print","Execute","PrintScreen","Insert","Delete","","0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","Win","","ContextMenu","","Sleep","0","1","2","3","4","5","6","7","8","9","*","+",".","-",".","/","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","","","","","","","","","NumLock","ScrollLock","WIN_OEM_FJ_JISHO","WIN_OEM_FJ_MASSHOU","WIN_OEM_FJ_TOUROKU","WIN_OEM_FJ_LOYA","WIN_OEM_FJ_ROYA","","","","","","","","","","^","!","\"","#","$","%","&","_","(",")","*","+","|","-","{","}","~","","","","","VolumeMute","VolumeDown","VolumeUp","","",";","=",",","-",".","/","`","","","","","","","","","","","","","","","","","","","","","","","","","","","[","\\","]","\'","","Meta","AltGr","","WIN_ICO_HELP","WIN_ICO_00","","WIN_ICO_CLEAR","","","WIN_OEM_RESET","WIN_OEM_JUMP","WIN_OEM_PA1","WIN_OEM_PA2","WIN_OEM_PA3","WIN_OEM_WSCTRL","WIN_OEM_CUSEL","WIN_OEM_ATTN","WIN_OEM_FINISH","WIN_OEM_COPY","WIN_OEM_AUTO","WIN_OEM_ENLW","WIN_OEM_BACKTAB","ATTN","CRSEL","EXSEL","EREOF","PLAY","ZOOM","","PA1","WIN_OEM_CLEAR",""];
  var shiftKeyboardMap = ["","","","Cancel","","","Help","","Backspace","Tab","","","Clear","Enter","Return","","Shift","Control","Alt","Pause","CapsLock","Kana","Eisu","Junja","Final","Hanja","","Escape","Convert","NonConvert","Accept","ModeChange","Space","PageUp","PageDown","End","Home","ArrowLeft","ArrowUp","ArrowRight","ArrowDown","Select","Print","Execute","PrintScreen","Insert","Delete","",")","!","@","#","$","%","^","&","*","(",":",":","<","+",">","?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","Win","","ContextMenu","","Sleep","","End","ArrowDown","PageDown","ArrowLeft","5","ArrowRight","Home","ArrowUp","PageUp","*","+","Separator","-",".","/","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","","","","","","","","","NumLock","ScrollLock","WIN_OEM_FJ_JISHO","WIN_OEM_FJ_MASSHOU","WIN_OEM_FJ_TOUROKU","WIN_OEM_FJ_LOYA","WIN_OEM_FJ_ROYA","","","","","","","","","","^","!","\"","#","$","%","&","_","(",")","*","+","|","-","{","}","~","","","","","VolumeMute","VolumeDown","VolumeUp","","",":","+","<","_",">","|","~","","","","","","","","","","","","","","","","","","","","","","","","","","","{","|","}","\"","","Meta","AltGr","","WIN_ICO_HELP","WIN_ICO_00","","WIN_ICO_CLEAR","","","WIN_OEM_RESET","WIN_OEM_JUMP","WIN_OEM_PA1","WIN_OEM_PA2","WIN_OEM_PA3","WIN_OEM_WSCTRL","WIN_OEM_CUSEL","WIN_OEM_ATTN","WIN_OEM_FINISH","WIN_OEM_COPY","WIN_OEM_AUTO","WIN_OEM_ENLW","WIN_OEM_BACKTAB","ATTN","CRSEL","EXSEL","EREOF","PLAY","ZOOM","","PA1","WIN_OEM_CLEAR",""];

  if (e.keyCode == 0 && e.which != 0) {
    return String.fromCharCode(e.charCode);
  } else if (e.shiftKey) {
    return shiftKeyboardMap[e.which || e.keyCode || e.charCode];
  } else {
    return keyboardMap[e.which || e.keyCode || e.charCode];
  }
}

function Editor($e) {
  this.$gutter = $e.find('.gutter ul');
  this.$text = $e.find('.lines');
  this.$cursor = $('#cursor');
  this.charWidth = 10.8;

  this.code = [
    '// Author: Mariusz Różycki',
    'size(600, 600);',
    'const PI = 3.1415926535',
    '',
    'var circle = {x: 0, y: 0, r: 10};',
    'var points = [[]];',
    '',
    'var myLine = function(a, b) {',
    '    line(a.x, a.y, b.x, b.y);',
    '}',
    '',
    'draw = function() {',
    '    background(255);',
    '    stroke(0);',
    '    strokeWeight(1);',
    '    ellipse(circle.x, circle.y, 2*circle.r, 2*circle.r);',
    '    ',
    '    circle.x = mouseX;',
    '    circle.y = mouseY;',
    '    if (mousePressed) {',
    '        points[points.length-1].push({x: mouseX, y: mouseY});',
    '    } else if (points[points.length-1].length > 0) {',
    '        points.push([]);',
    '    }',
    '    ',
    '    strokeWeight(5);',
    '    var t = 0;',
    '    for (var i = 0; i < points.length; i++) {',
    '        for (var j = 0; j < points[i].length-1; j++) {',
    '            stroke(128*(sin(t+2*PI/3)+1), 128*(sin(t)+1), 128*(sin(t+4*PI/3)+1));',
    '            t += 0.01;',
    '            myLine(points[i][j], points[i][j+1]);',
    '        }',
    '    }',
    '}',
  ];

//  this.code = [
//    '// Author: Mariusz Różycki',
//    'size(600, 600);',
//    'const PI = 3.1415926535;',
//    '',
//    'var t = 0;',
//    'draw = function() {',
//    '    background(255, 255, 255);',
//    '    fill(128*(sin(t)+1), 128*(sin(t+2*PI/3)+1), 128*(sin(t+4*PI/3)+1));',
//    '    ellipse(width/2, height/2, width/4*(sin(t)+2), height/4*(cos(t)+2));',
//    '    t += 0.1;',
//    '}',
//  ];

  this.cursor = {x: 0, y: 0};
}


Editor.prototype.formatLine = function(line, active) {
  line = line.replace(/(.|^)("[^"]*")([^>]|$)/g, '$1<span class="string">$2</span>$3');
  line = line.replace(/(.|^)('[^"]*')([^>]|$)/g, '$1<span class="string">$2</span>$3');
  line = line.replace(/([0-9]+(\.[0-9]*)?)/g, '<span class="number">$1</span>');
  line = line.replace(/([^a-zA-Z0-9]|^)(var|function|const|else if|if|else|for|while|return)([^a-zA-Z0-9]|$)/g, '$1<span class="keyword">$2</span>$3');
  line = line.replace(/([^a-zA-Z0-9]|^)(push|strokeWeight|rect|log|print|line|background|size|ellipse|fill|stroke|noStroke|noFill|sin|cos)([^a-zA-Z0-9]|$)/g, '$1<span class="function">$2</span>$3');
  line = line.replace(/([^a-zA-Z0-9]|^)(true|false)([^a-zA-Z0-9]|$)/g, '$1<span class="boolean">$2</span>$3');
  line = line.replace(/([^a-zA-Z0-9]|^)(length|console|width|height|mouseX|mouseY|mousePressed)([^a-zA-Z0-9]|$)/g, '$1<span class="identifier">$2</span>$3');
  line = line.replace(/(\/\/.*)$/, '<span class="comment">$1</span>');

  var result = $('<pre></pre>').addClass('line').html(line);
  if (active) {
    result.addClass('cursor');
  }
  return result;
}

Editor.prototype.currentLine = function(line) {
  if (line === undefined) {
    return this.code[this.cursor.y];
  }

  this.code[this.cursor.y] = line;
  return line;
}

Editor.prototype.generateLineNumber = function(number, active) {
  var result = $('<li></li>').text(number);

  if (active) {
    result.addClass('cursor');
  }
  return result;
}

Editor.prototype.getIndentLevel = function(line) {
  var result = 0;
  for (var i = 0; i < line.length; i++) {
    if (line[i] == " ") {
      result++;
    } else {
      break;
    }
  }
  return result;
}

Editor.prototype.indent = function(line, amount) {
  if (amount >= 0) {
    return new Array(amount+1).join(" ")+line;
  }

  if (-amount < this.getIndentLevel(line)) {
    return line.slice(-amount);
  }

  return line.slice(this.getIndentLevel(line));
}

Editor.prototype.render = function() {
  this.$gutter.empty();
  this.$text.empty();

  var self = this;
  $.each(this.code, function(k, v) {
    self.$gutter.append(self.generateLineNumber(k+1, k == self.cursor.y));
    self.$text.append(self.formatLine(v, k == self.cursor.y));
  });

  var charWidth = this.charWidth;
  var charHeight = this.$cursor.height();

  this.$cursor.css({
    top: this.cursor.y*charHeight+"px",
    left: Math.min(this.cursor.x, this.currentLine().length)*charWidth+"px"
  });
}

Editor.prototype.insert = function(character) {
  if (character[0] == '}' && this.currentLine().trim() == "") {
    this.currentLine(this.indent(this.currentLine(), -4));
  }

  this.code[this.cursor.y] =
    this.code[this.cursor.y].slice(0, this.cursor.x)
    + character
    + this.code[this.cursor.y].slice(this.cursor.x);

  this.cursor.x += character.length;
}

Editor.prototype.getCode = function() {
  return this.code.join('\n');
}

Editor.prototype.keyHandlers = [];

Editor.prototype.keyHandlers['Backspace'] = function() {
  if (this.cursor.x == 0 && this.cursor.y == 0) {
    return;
  }

  if (this.cursor.x > this.code[this.cursor.y].length) {
    this.cursor.x = this.code[this.cursor.y].length;
  }

  if (this.cursor.x == 0) {
    var line = this.code.splice(this.cursor.y, 1);
    this.cursor.x = this.code[this.cursor.y-1].length;
    this.code[this.cursor.y-1] += line;
    this.cursor.y--;
    return;
  }

  this.code[this.cursor.y] =
    this.code[this.cursor.y].slice(0, Math.max(0, this.cursor.x-1))
    + this.code[this.cursor.y].slice(this.cursor.x);
  this.cursor.x = Math.max(this.cursor.x-1, 0);
}

Editor.prototype.keyHandlers['Delete'] = function() {
  if (this.cursor.y >= this.code.length-1 
    && this.cursor.x >= this.code[this.cursor.y].length) {
    return;
  }

  this.keyHandlers['ArrowRight'].apply(this);
  this.keyHandlers['Backspace'].apply(this);
}

Editor.prototype.keyHandlers['Enter'] = function() {
  var line = this.currentLine();
  this.currentLine(line.slice(0, this.cursor.x));

  this.code.splice(
    this.cursor.y+1, 0, 
    this.indent(
      line.slice(this.cursor.x), 
      this.getIndentLevel(this.currentLine()) 
        + (this.currentLine().substr(-1) == "{" ? 4 : 0)
    )
  );

  this.cursor.y++;
  this.cursor.x = this.getIndentLevel(this.currentLine());
}

Editor.prototype.keyHandlers['Tab'] = function() {
  this.insert(new Array(5).join(' '));
}

Editor.prototype.keyHandlers['ArrowDown'] = function() {
  if (this.cursor.y >= this.code.length-1) {
    this.cursor.x = this.currentLine().length;
    return;
  }

  this.cursor.y = this.cursor.y+1;
}

Editor.prototype.keyHandlers['ArrowUp'] = function() {
  if (this.cursor.y <= 0) {
    this.cursor.x = 0;
    return;
  }

  this.cursor.y = Math.max(0, this.cursor.y-1);
}

Editor.prototype.keyHandlers['ArrowRight'] = function() {
  this.cursor.x = this.cursor.x+1;
  if (this.cursor.x > this.code[this.cursor.y].length 
      && this.cursor.y < this.code.length-1) {
    this.cursor.y ++;
    this.cursor.x = 0;
  } else if (this.cursor.x > this.code[this.cursor.y].length) {
    this.cursor.x = this.code[this.cursor.y].length;
  }
}

Editor.prototype.keyHandlers['ArrowLeft'] = function() {
  this.cursor.x = this.cursor.x-1;
  if (this.cursor.x < 0 && this.cursor.y > 0) {
    this.cursor.y--;
    this.cursor.x = this.code[this.cursor.y].length;
  } else if (this.cursor.x < 0) {
    this.cursor.x = 0;
  } else if (this.cursor.x-1 > this.code[this.cursor.y].length) {
    this.cursor.x = this.code[this.cursor.y].length-1;
  }
}

Editor.prototype.keyHandlers['End'] = function() {
  this.cursor.x = this.code[this.cursor.y].length;
}

Editor.prototype.keyHandlers['Home'] = function() {
  this.cursor.x = 0;
}

Editor.prototype.keyHandlers['Escape'] = function() {
  $('#input-hack').val('');
}

Editor.prototype.handleKeyPress = function(e) {
  if (e.metaKey || e.ctrlKey) {
    return;
  }
  
  var key = e.key || getKeyName(e);
  if (this.keyHandlers[key]) {
    e.preventDefault();
    this.keyHandlers[key].apply(this);
  } else if(key.length == 1) {
    e.preventDefault();
    this.insert(key);
  } else {
    console.log(key);
  }

  this.render();
}

Editor.prototype.handleMouseDown = function(e) {
  var offset = this.$text.offset();
  
  var ax = e.pageX - offset.left;
  var ay = e.pageY - offset.top;
  var charWidth = this.charWidth;
  var charHeight = this.$cursor.height();
  this.cursor.y = Math.min(Math.floor(ay/charHeight), this.code.length);
  this.cursor.x = Math.min(Math.round(ax/charWidth), this.currentLine().length);

  this.render();
}

var editor = new Editor($editor);
editor.render();
$('#input-hack').focus();
$('#input-hack').val('');

$('#editor .lines').mousedown(function(e) {
  e.preventDefault();
  editor.handleMouseDown(e);
  $('#input-hack').focus();
});

$('#input-hack').on('input', function(e) {
  if (e.cancelable) {
    $(this).val('');
    return;
  }

  editor.insert(this.value);
  editor.render();
  $(this).val('');
});

$('#input-hack').on('keydown', function(e) {
  var key = getKeyName(e);

  if (key == 'Tab' || key == 'ArrowLeft' || key == 'ArrowRight') {
    e.preventDefault();
  }

  if (editor.keyHandlers[key]) {
    editor.keyHandlers[key].apply(editor);
    editor.render();
  }
});

var code = editor.getCode();
var canvas = document.getElementById("preview-canvas");
var instance = new Processing(canvas, code);

setInterval(function() {
  if (code.trim() != editor.getCode().trim()) {
    code = editor.getCode();
    instance.exit();
    instance = new Processing(canvas, code);
  }
}, 1000);
