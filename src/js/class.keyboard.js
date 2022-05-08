import TextAreaBuilder from './class.text_area_builder';

export default class Keyboard {
  constructor(alphabets) {
    this.alphabets = alphabets;
    this.textAreaBuilder = null;
    this.isCapsLock = false;
    this.isShift = false;
    this.isAlt = false;
    this.isRussian = false;
  }

  static resolveClassName(letter) {
    const buttonClass = letter[1].buttonClass ? `${letter[1].buttonClass} ` : '';
    return `keyboard__button ${buttonClass}${letter[0]}`;
  }

  generateMainWindow() {
    const language = localStorage.getItem('language');
    this.isRussian = language === 'RU';

    const main = document.createElement('main');
    main.className = 'main';

    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    const keyboard = document.createElement('div');
    keyboard.className = 'keyboard';

    const keyboardTitle = document.createElement('h1');
    keyboardTitle.className = 'keyboard__title';
    keyboardTitle.append('RSS Keyboard');

    const keyboardInner = document.createElement('div');
    keyboardInner.className = 'keyboard__inner';

    const textarea = document.createElement('textarea');
    textarea.className = 'keyboard__textarea';
    textarea.setAttribute('placeholder', 'Ваш текст ...');
    textarea.setAttribute('cols', '30');
    textarea.setAttribute('rows', '10');

    this.textAreaBuilder = new TextAreaBuilder(textarea);

    const keyboardButtons = document.createElement('div');
    keyboardButtons.className = 'keyboard__buttons';
    wrapper.append(keyboardTitle);
    const text = document.createElement('div');
    text.className = 'keyboard__text';
    text.append('This keyboard is based on the Windows keyboard ');
    text.append('To switch language press Left Shift + Left Alt');

    wrapper.append(text);

    keyboardInner.append(textarea);
    keyboardButtons.append(this.#generateRow(0, 14));
    keyboardButtons.append(this.#generateRow(14, 15));
    keyboardButtons.append(this.#generateRow(29, 13));
    keyboardButtons.append(this.#generateRow(42, 13));
    keyboardButtons.append(this.#generateRow(55, 9));
    keyboardInner.append(keyboardButtons);
    keyboard.append(keyboardInner);
    wrapper.append(keyboard);

    main.append(wrapper);

    return main;
  }

  /**
   * Hande keyboard key press events
   * @param {*} event keyboard key press event
   */
  handleKeyDownEvent(event) {
    if (this.#resolveLanguage()[event.code]) {
      event.preventDefault();
    }
    const button = document.querySelector(`.${event.code}`);
    this.#doVirtualKeyboardPressAction(button, event.code);
  }

  /**
   * Handle mouse button down event
   * @param {*} event mouse button down event
   */
  handleMouseDownEvent(event) {
    document.querySelector('textarea').focus();
    const buttonId = event.target.getAttribute('data-id');

    if (event.target.localName === 'button') {
      this.#doVirtualKeyboardPressAction(event.target, buttonId);
    }
  }

  updateButtons() {
    const buttons = document.querySelectorAll('.keyboard__button');
    for (let i = 0; i < buttons.length; i += 1) {
      const letterData = this.#resolveLanguage()[buttons[i].getAttribute('data-id')];
      buttons[i].innerHTML = this.isShift || this.isCapsLock
        ? letterData.letterBig
        : letterData.letterSmall;
    }
  }

  /**
   * Handle keyboard key up event
   * @param {*} event keyboard key up event
   */
  handleKeyUpEvent(event) {
    event.preventDefault();
    const button = document.querySelector(`.${event.code}`);
    this.#doVirtualKeyboardReleaseAction(button, event.code);
  }

  /**
   * Handle mouse button up event
   * @param {*} event mouse button up event
   */
  handleMouseUpEvent(event) {
    document.querySelector('textarea').focus();
    const classNames = event.target.className.split(' ');
    const latestClass = classNames[classNames.length - 2];

    if (event.target.localName === 'button') {
      this.#doVirtualKeyboardReleaseAction(event.target, latestClass);
    }
  }

  #generateRow(skip, limit) {
    this.arrayButtons = [];
    const row = document.createElement('div');
    row.className = 'keyboard__buttons-row';
    this.#generateButton(skip, limit).forEach((element) => {
      row.append(element);
    });
    return row;
  }

  #generateButton(skip, limit) {
    return Object.entries(this.#resolveLanguage())
      .slice(skip, skip + limit)
      .map((letter) => {
        let template = '';
        const button = document.createElement('button');
        button.setAttribute('data-id', letter[0]);
        button.className = Keyboard.resolveClassName(letter);
        template += letter[1].letterSmall;
        button.innerHTML = template;
        return button;
      });
  }

  #resolveLanguage() {
    return this.isRussian ? this.alphabets.RU : this.alphabets.EN;
  }

  #doVirtualKeyboardPressAction(targetElement, keyCode) {
    if (!targetElement || !keyCode) return;
    document.querySelector('textarea').focus();
    targetElement.classList.toggle('active');
    if (keyCode === 'Backspace') {
      this.textAreaBuilder.releaseBackspace();
    } else if (keyCode === 'Space') {
      this.textAreaBuilder.releaseSpace();
    } else if (keyCode === 'Tab') {
      this.textAreaBuilder.releaseTab();
    } else if (keyCode === 'ShiftLeft' || keyCode === 'ShiftRight') {
      this.isShift = true;
      if (this.isAlt) {
        this.isRussian = !this.isRussian;
        localStorage.setItem('language', this.isRussian ? 'RU' : 'EN');
      }
      this.updateButtons();
    } else if (keyCode === 'CapsLock') {
      this.isCapsLock = !this.isCapsLock;
      this.updateButtons();
    } else if (keyCode === 'Enter') {
      this.textAreaBuilder.releaseEnter();
    } else if (keyCode === 'Delete') {
      this.textAreaBuilder.releaseDelete();
    } else if (keyCode === 'ArrowLeft' || keyCode === 'ArrowUp') {
      this.textAreaBuilder.releaseLeftArrow();
    } else if (keyCode === 'ArrowRight' || keyCode === 'ArrowDown') {
      this.textAreaBuilder.releaseRightArrow();
    } else if (keyCode === 'MetaLeft') {
      this.textAreaBuilder.writeSymbol('⛄', this.isCapsLock || this.isShift);
    } else if (keyCode === 'ControlRight' || keyCode === 'ControlLeft') {
      this.textAreaBuilder.writeSymbol('', this.isCapsLock || this.isShift);
    } else if (keyCode === 'AltRight' || keyCode === 'AltLeft') {
      this.isAlt = true;
      if (this.isShift) {
        this.isRussian = !this.isRussian;
        localStorage.setItem('language', this.isRussian ? 'RU' : 'EN');
      }
    } else {
      const symbol = this.#resolveLanguage()[keyCode];
      const letter = this.isShift ? symbol.letterBig : symbol.letterSmall;
      this.textAreaBuilder.writeSymbol(letter, this.isCapsLock || this.isShift);
    }
  }

  #doVirtualKeyboardReleaseAction(targetElement, keyCode) {
    if (!targetElement || !keyCode) return;

    document.querySelector('textarea').focus();
    if (keyCode === 'CapsLock') {
      if (!this.isCapsLock) {
        targetElement.classList.remove('active');
      }
    } else {
      targetElement.classList.remove('active');

      if (keyCode === 'ShiftLeft' || keyCode === 'ShiftRight') {
        this.isShift = false;
        this.isAlt = false;
        this.updateButtons();
      }
      if (keyCode === 'AltLeft' || keyCode === 'AltRight') {
        this.isAlt = false;
        this.isShift = false;
      }
    }
  }
}
