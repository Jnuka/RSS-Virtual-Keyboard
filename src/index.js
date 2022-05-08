import english from './js/english';
import russian from './js/russian';
import Keyboard from './js/class.keyboard';

import './sass/style.css';

const virtualKeyboard = new Keyboard({ EN: english, RU: russian });
document.body.append(virtualKeyboard.generateMainWindow());

document.addEventListener('keydown', (event) => virtualKeyboard.handleKeyDownEvent(event));
document.addEventListener('keyup', (event) => virtualKeyboard.handleKeyUpEvent(event));
document.addEventListener('mousedown', (event) => virtualKeyboard.handleMouseDownEvent(event));
document.addEventListener('mouseup', (event) => virtualKeyboard.handleMouseUpEvent(event));
document.querySelectorAll('button').forEach((element) => element.addEventListener('mouseleave', (event) => virtualKeyboard.handleMouseUpEvent(event)));
