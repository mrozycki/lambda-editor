var $editor = $('#editor');

var sanitize = function(line) {
  return $('<span></span>').text(line).html();
}

var getKeyName = function(e) {
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
  this.cursor = {startX: 0, startY: 0, endX: 0, endY: 0};
  this.isMouseDown = false;
  this.isWaitingForInput = false;
  this.isRendering = false;
  this.code = [''];
  this.topLine = 1;
  this.bottomLine = 1;

//  this.code = [
//    '// Author: Mariusz Różycki',
//    'const PI = 3.1415926535',
//    '',
//    'var circle = {x: 0, y: 0, r: 10};',
//    'var points = [[]];',
//    '',
//    'var myLine = function(a, b) {',
//    '    line(a.x, a.y, b.x, b.y);',
//    '}',
//    '',
//    'draw = function() {',
//    '    background(255);',
//    '    stroke(0);',
//    '    strokeWeight(1);',
//    '    ellipse(circle.x, circle.y, 2*circle.r, 2*circle.r);',
//    '    ',
//    '    circle.x = mouseX;',
//    '    circle.y = mouseY;',
//    '    if (mousePressed) {',
//    '        points[points.length-1].push({x: mouseX, y: mouseY});',
//    '    } else if (points[points.length-1].length > 0) {',
//    '        points.push([]);',
//    '    }',
//    '    ',
//    '    strokeWeight(5);',
//    '    var t = 0;',
//    '    for (var i = 0; i < points.length; i++) {',
//    '        for (var j = 0; j < points[i].length-1; j++) {',
//    '            stroke(128*(sin(t+2*PI/3)+1), 128*(sin(t)+1), 128*(sin(t+4*PI/3)+1));',
//    '            t += 0.01;',
//    '            myLine(points[i][j], points[i][j+1]);',
//    '        }',
//    '    }',
//    '}',
//  ];

//   this.code = [
//     '// Author: Mariusz Różycki',
//     'var points = [];',
//     'for (var i = 0, t = 0; i < 629; i++, t += 0.01) {',
//     '    points.push({x: width/2*(sin(13*t)+1), y: height/2*(cos(19*t)+1)});',
//     '}',
//     '',
//     'var t = 0;',
//     'draw = function() {',
//     '    background(255);',
//     '    strokeWeight(width/60);',
//     '    ',
//     '    for (var i = 0; i < points.length-1; i++, t+= 0.2) {',
//     '        stroke(128*(sin(t+2*PI/3)+1), 128*(sin(t)+1), 128*(sin(t+4*PI/3)+1));',
//     '        line(points[i].x, points[i].y, points[i+1].x, points[i+1].y);',
//     '    }',
//     '}',
//   ];

//  this.code = [
//    '// Author: Mariusz Różycki',
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
}

Editor.prototype.getCharWidth = function() {
  var $hack = $("#text-width-hack");
  return $hack.innerWidth() / $hack.text().length;
}

Editor.prototype.formatLine = function(line, active) {
  line = line.replace(/(.|^)("[^"]*")([^>]|$)/g, '$1<span class="color string">$2</span>$3');
  line = line.replace(/(.|^)('[^"]*')([^>]|$)/g, '$1<span class="color string">$2</span>$3');
  line = line.replace(/([0-9]+(\.[0-9]*)?)/g, '<span class="color number">$1</span>');
  line = line.replace(/([^a-zA-Z0-9]|^)(var|function|const|else if|if|else|for|while|return)([^a-zA-Z0-9]|$)/g, '$1<span class="color keyword">$2</span>$3');
  line = line.replace(/([^a-zA-Z0-9]|^)(push|strokeWeight|rect|log|print|line|background|size|ellipse|fill|stroke|noStroke|noFill|sin|cos|tan|cot|max|min|abs|pow|sqrt)([^a-zA-Z0-9]|$)/g, '$1<span class="color function">$2</span>$3');
  line = line.replace(/([^a-zA-Z0-9]|^)(true|false)([^a-zA-Z0-9]|$)/g, '$1<span class="color boolean">$2</span>$3');
  line = line.replace(/([^a-zA-Z0-9]|^)(length|console|width|height|mouseX|mouseY|mousePressed)([^a-zA-Z0-9]|$)/g, '$1<span class="color identifier">$2</span>$3');
  line = line.replace(/(\/\/.*)$/, '<span class="color comment">$1</span>');

  var result = $('<pre></pre>').addClass('line').html(line);
  if (active && this.selectionEmpty()) {
    result.addClass('color cursor');
  }
  return result;
}

Editor.prototype.currentLine = function(line) {
  if (line === undefined) {
    return this.code[this.cursor.endY];
  }

  this.code[this.cursor.endY] = line;
  return line;
}

Editor.prototype.generateLineNumber = function(number) {
  return $('<li></li>').text(number);
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
  var result;
  if (amount >= 0) {
    result = new Array(amount+1).join(" ")+line;
  } else if (-amount < this.getIndentLevel(line)) {
    result = line.slice(-amount);
  } else {
    result = line.slice(this.getIndentLevel(line));
  }

  return result;
}

Editor.prototype.selectAll = function() {
  this.cursor.startX = 0;
  this.cursor.startY = 0;
  this.cursor.endY = this.code.length-1;
  this.cursor.endX = this.code[this.code.length-1].length;
  this.render();
}

Editor.prototype.selectionBoundaries = function() {
  if (this.cursor.startY > this.cursor.endY) {
    return { startX: this.cursor.endX, startY: this.cursor.endY,
      endX: this.cursor.startX, endY: this.cursor.startY };
  }

  if (this.cursor.startY == this.cursor.endY) {
    var y = this.cursor.startY;
    var sx = Math.min(this.cursor.startX, this.cursor.endX);
    var ex = Math.max(this.cursor.startX, this.cursor.endX);
    return { startX: sx, startY: y, endX: ex, endY: y }
  }

  return this.cursor;
}

Editor.prototype.lineSelected = function(k) {
  return this.cursor.startY < k && k < this.cursor.endY
    || this.cursor.startY > k && k > this.cursor.endY;
}

Editor.prototype.selectionEmpty = function() {
  return this.cursor.startY == this.cursor.endY 
    && this.cursor.startX == this.cursor.endX;
}

Editor.prototype.selectedText = function() {
  if (this.cursor.startY == this.cursor.endY 
    && this.cursor.startX == this.cursor.endX) {
    return "";
  }

  var boundaries = this.selectionBoundaries();
  if (boundaries.startY == boundaries.endY) {
    return this.code[boundaries.startY]
      .slice(boundaries.startX, boundaries.endX);
  }

  return [this.code[boundaries.startY].slice(boundaries.startX)]
    .concat(this.code.slice(boundaries.startY+1, boundaries.endY))
    .concat([this.code[boundaries.endY].slice(0, boundaries.endX)]).join('\n');
}

Editor.prototype.deleteSelectedText = function() {
  if (this.selectionEmpty()) {
    return;
  }

  var boundaries = this.selectionBoundaries();
  if (boundaries.startY == boundaries.endY) {
    this.code[boundaries.startY] =
      this.code[boundaries.startY].slice(0, boundaries.startX)
      + this.code[boundaries.startY].slice(boundaries.endX);

    this.cursor.endX = boundaries.startX;
    this.cursor.endY = boundaries.startY;
    this.syncCursors();
    return;
  }

  this.code[boundaries.startY] = 
    this.code[boundaries.startY].slice(0, boundaries.startX) +
    this.code[boundaries.endY].slice(boundaries.endX);

  this.code.splice(boundaries.startY+1, boundaries.endY-boundaries.startY);

  this.cursor.endX = boundaries.startX;
  this.cursor.endY = boundaries.startY;
  this.syncCursors();
  this.render();
}

Editor.prototype.updateGutter = function(k) {
  var lineDifference = this.$gutter.children().length - this.code.length;

  if (lineDifference < 0) {
    for (var i = this.$gutter.children().length+1; i <= this.code.length; i++) {
      this.$gutter.append(this.generateLineNumber(i));
    }
  } else if (lineDifference > 0) {
    var self = this;
    this.$gutter.children().each(function(k, v) {
      if (k >= self.code.length) {
        v.remove();
      }
    });
  }

  var $activeLine = this.$gutter.children('.cursor');
  if (this.$gutter.children().index($activeLine) != this.cursor.endY) {
    $activeLine.removeClass('cursor');
    $(this.$gutter.children().get(this.cursor.endY)).addClass('cursor');
  }
}

Editor.prototype.renderLine = function(k) {
  var selectionBoundaries = this.selectionBoundaries();
  var line = this.code[k];
  if (this.selectionEmpty()) {
    line = sanitize(line);
  } else if (this.lineSelected(k)) {
    line = '<span class="color selected">'+sanitize(line)+'</span>';
  } else if (selectionBoundaries.startY == k && selectionBoundaries.endY == k) {
    line = sanitize(line.slice(0, selectionBoundaries.startX))
      + '<span class="color selected">'+sanitize(line.slice(selectionBoundaries.startX, selectionBoundaries.endX))+'</span>'
      + sanitize(line.slice(selectionBoundaries.endX));
  } else if (selectionBoundaries.startY == k) {
    line = sanitize(line.slice(0, selectionBoundaries.startX))
      + '<span class="color selected">'+sanitize(line.slice(selectionBoundaries.startX))+'</span>';
  } else if (selectionBoundaries.endY == k) {
    line = '<span class="color selected">'+sanitize(line.slice(0, selectionBoundaries.endX))+'</span>'
      + sanitize(line.slice(selectionBoundaries.endX));
  }

  return this.formatLine(line, k == this.cursor.endY);
}

Editor.prototype.renderScroll = function() {
  if (this.cursor.endY < this.topLine) {
    this.topLine = this.cursor.endY;
    this.bottomLine = this.topLine 
      + Math.floor($editor.height()/this.$cursor.height());
  }

  if (this.cursor.endY > this.bottomLine) {
    this.bottomLine = this.cursor.endY;
    this.topLine = this.bottomLine 
      - Math.floor($editor.height()/this.$cursor.height()) + 1;
  }

  console.log(this.topLine, this.bottomLine);
  $editor.scrollTop((this.topLine) * this.$cursor.height());
}

Editor.prototype.render = function() {
  console.log('render');
  this.rendering = true;
  this.updateGutter();
  this.renderScroll();
  this.$text.empty();

  var self = this;
  $.each(this.code, function(k) {
    self.$text.append(self.renderLine(k));
  });

  var charWidth = this.getCharWidth();
  var charHeight = this.$cursor.height();

  this.$cursor.css({
    top: this.cursor.endY*charHeight+"px",
    left: Math.max(0, Math.min(this.cursor.endX, this.currentLine().length))*charWidth+"px"
  });

  this.rendering = false;
}

Editor.prototype.insert = function(character, noIndent) {
  this.deleteSelectedText();

  if (character[0] == '}' && this.currentLine().trim() == "" && !noIndent) {
    this.currentLine(this.indent(this.currentLine(), -4));
  }

  this.code[this.cursor.endY] =
    this.code[this.cursor.endY].slice(0, this.cursor.endX)
    + character
    + this.code[this.cursor.endY].slice(this.cursor.endX);

  this.cursor.endX += character.length;
  this.syncCursors();
  editor.render();
}

Editor.prototype.paste = function(data) {
  this.deleteSelectedText();
  var lines = data.split('\n');
  for (var i = 0; i < lines.length-1; i++) {
    this.insert(lines[i], true);
    this.keyHandlers['Enter'].apply(this, [true]);
  }
  this.insert(lines[lines.length-1]);
}

Editor.prototype.getCode = function() {
  return ["size(600,600);"].concat(this.code).join('\n');
}

Editor.prototype.syncCursors = function(shift) {
  if (!shift) {
    this.cursor.startY = this.cursor.endY;
    this.cursor.startX = this.cursor.endX;
  }
}

Editor.prototype.keyHandlers = [];

Editor.prototype.keyHandlers['Backspace'] = function() {
  if (!this.selectionEmpty()) {
    this.deleteSelectedText();
    return;
  }

  if (this.cursor.endX == 0 && this.cursor.endY == 0) {
    return;
  }

  if (this.cursor.endX > this.code[this.cursor.endY].length) {
    this.cursor.endX = this.code[this.cursor.endY].length;
  }

  if (this.cursor.endX == 0) {
    var line = this.code.splice(this.cursor.endY, 1);
    this.cursor.endX = this.code[this.cursor.endY-1].length;
    this.code[this.cursor.endY-1] += line;
    this.cursor.endY--;
    this.syncCursors();
    return;
  }

  this.code[this.cursor.endY] =
    this.code[this.cursor.endY].slice(0, Math.max(0, this.cursor.endX-1))
    + this.code[this.cursor.endY].slice(this.cursor.endX);
  this.cursor.endX = Math.max(this.cursor.endX-1, 0);

  this.syncCursors();
}

Editor.prototype.keyHandlers['Delete'] = function() {
  if (!this.selectionEmpty()) {
    this.deleteSelectedText();
    return;
  }

  if (this.cursor.endY >= this.code.length-1 
    && this.cursor.endX >= this.code[this.cursor.endY].length) {
    return;
  }

  this.keyHandlers['ArrowRight'].apply(this, [false]);
  this.keyHandlers['Backspace'].apply(this);
}

Editor.prototype.keyHandlers['Enter'] = function(noIndent) {
  this.deleteSelectedText();
  var line = this.currentLine();
  this.currentLine(line.slice(0, this.cursor.endX));

  this.code.splice(
    this.cursor.endY+1, 0, 
    this.indent(
      line.slice(this.cursor.endX), 
      (noIndent ? 0 :
        this.getIndentLevel(this.currentLine()) 
          + (this.currentLine().substr(-1) == "{" ? 4 : 0)
      )
    )
  );

  this.cursor.endY++;
  this.cursor.endX = this.getIndentLevel(this.currentLine());
  this.syncCursors();
}

Editor.prototype.keyHandlers['Tab'] = function(shift, control, alt) {
  if (control || alt) return;
  var indent = 4 * (shift ? -1 : 1);
  var selectionEmpty = this.selectionEmpty();
  var boundaries = this.selectionBoundaries();
  for (var i = boundaries.startY; i <= boundaries.endY; i++) {
    this.code[i] = this.indent(this.code[i], indent);
  }

  this.cursor.endX += indent;
  if (selectionEmpty) {
    this.syncCursors();
  } else {
    this.cursor.startX += indent;
  }
}

Editor.prototype.keyHandlers['ArrowDown'] = function(shift) {
  if (this.cursor.endY >= this.code.length-1) {
    this.cursor.endX = this.currentLine().length;
  } else {
    this.cursor.endY = this.cursor.endY+1;
  }

  this.syncCursors(shift);
}

Editor.prototype.keyHandlers['ArrowUp'] = function(shift) {
  if (this.cursor.endY <= 0) {
    this.cursor.endX = 0;
  } else {
    this.cursor.endY = Math.max(0, this.cursor.endY-1);
  }

  this.syncCursors(shift);
}

Editor.prototype.keyHandlers['ArrowRight'] = function(shift) {
  this.cursor.endX = this.cursor.endX+1;
  if (this.cursor.endX > this.code[this.cursor.endY].length 
      && this.cursor.endY < this.code.length-1) {
    this.cursor.endY ++;
    this.cursor.endX = 0;
  } else if (this.cursor.endX > this.code[this.cursor.endY].length) {
    this.cursor.endX = this.code[this.cursor.endY].length;
  }
  this.syncCursors(shift);
}

Editor.prototype.keyHandlers['ArrowLeft'] = function(shift) {
  this.cursor.endX = this.cursor.endX-1;
  if (this.cursor.endX < 0 && this.cursor.endY > 0) {
    this.cursor.endY--;
    this.cursor.endX = this.code[this.cursor.endY].length;
  } else if (this.cursor.endX < 0) {
    this.cursor.endX = 0;
  } else if (this.cursor.endX-1 > this.code[this.cursor.endY].length) {
    this.cursor.endX = this.code[this.cursor.endY].length-1;
  }
  this.syncCursors(shift);
}

Editor.prototype.keyHandlers['End'] = function(shift) {
  this.cursor.endX = this.code[this.cursor.endY].length;
  this.syncCursors(shift);
}

Editor.prototype.keyHandlers['Home'] = function(shift) {
  this.cursor.endX = 0;
  this.syncCursors(shift);
}

Editor.prototype.keyHandlers['Escape'] = function() {
  $('#input-hack').val('');
  this.syncCursors();
}

Editor.prototype.keyHandlers['Control'] = function() {
  if (!this.selectionEmpty()) {
    $('#clipboard')
      .val(this.selectedText())
      .focus()
      .select();
  } else {
    $('#clipboard')
      .focus();
  }
}

Editor.prototype.mouseToCursorCoords = function(e) {
  var offset = this.$text.offset();
  var ax = e.pageX - offset.left;
  var ay = e.pageY - offset.top;
  var charWidth = this.getCharWidth();
  var charHeight = this.$cursor.height();

  var rx = Math.round(ax/charWidth);
  var ry = Math.floor(ay/charHeight);

  if (ry > this.code.length-1) {
    ry = this.code.length-1;
    rx = this.code[this.code.length-1].length;
  }

  if (ry < 0) {
    ry = 0;
    rx = 0;
  }

  return { x: rx, y: ry };
}

Editor.prototype.moveStartCursor = function(coords) {
  this.cursor.startX = coords.x;
  this.cursor.startY = coords.y;
}

Editor.prototype.moveEndCursor = function(coords) {
  this.cursor.endX = coords.x;
  this.cursor.endY = coords.y;
}

var editor = new Editor($editor);
editor.render();
$('#input-hack').focus();
$('#input-hack').val('');

$(document).mousedown(function(e) {
  e.preventDefault();
});

$('#editor').mousedown(function(e) {
  if (e.button == 2) {
    $('#context-menu-hack-container')
      .css({top: e.pageY-10+"px", left: e.pageX-10+"px"});
    $('#context-menu-hack')
      .val(editor.selectedText())
      .focus()
      .select()
      .trigger(e);

    editor.isWaitingForInput = true;
    return;
  }

  editor.isMouseDown = true;
  editor.moveStartCursor(editor.mouseToCursorCoords(e));
  $('#input-hack').focus();
});

$('#context-menu-hack').mousedown(function(e) {
  setTimeout(function() {
    $('#context-menu-hack-container')
      .css({top: "0px", left: "0px"});
  }, 200);
});

$('#context-menu-hack').on('input', function(e) {
  $('#input-hack').focus();
  if (!editor.isWaitingForInput) {
    $(this).val('');
    return;
  }

  editor.paste($(this).val());
  $(this).val('');
  editor.isWaitingForInput = false;
});

$('#editor').mousemove(function(e) {
  e.preventDefault();
  if (!editor.isMouseDown || editor.isRendering) return;
  editor.moveEndCursor(editor.mouseToCursorCoords(e));
  editor.render();
});

$('#editor').mouseup(function(e) {

  editor.isMouseDown = false;
  editor.moveEndCursor(editor.mouseToCursorCoords(e));
  editor.render();
});

$('#editor').mouseleave(function(e) {
  if (!editor.isMouseDown) return;
  editor.isMouseDown = false;
  editor.moveEndCursor(editor.mouseToCursorCoords(e));
  editor.render();
});

$('#input-hack').on('input', function(e) {
  if (e.cancelable) {
    $(this).val('');
    return;
  }

  editor.insert(this.value);
  $(this).val('');
});

$(document).on('keydown', function(e) {
  var key = getKeyName(e);

  if (key == 'Tab' || key == 'ArrowLeft' || key == 'ArrowRight') {
    e.preventDefault();
  }

  if (editor.keyHandlers[key]) {
    editor.keyHandlers[key].apply(editor, [e.shiftKey, e.ctrlKey, e.altKey]);
    editor.render();
  } 
});

$(document).on('keyup', function(e) {
  if (!$(e.target).is('#clipboard')) {
    return;
  }

  var key = getKeyName(e);

  if (key == 'c') {
    // do nothing, actually
  } else if (key == 'v') {
    editor.paste($('#clipboard').val());
  } else if (key == 'x') {
    editor.deleteSelectedText();
  } else if (key == 'a') {
    editor.selectAll();
    $('#clipboard')
      .val(editor.selectedText())
      .focus()
      .select();
  } if (key == 'Control') {
    $('#input-hack').focus();
    $('#clipboard').val('');
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
