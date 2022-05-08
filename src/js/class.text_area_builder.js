export default class TextAreaBuilder {
  constructor(textareaElement) {
    this.textarea = textareaElement;
  }

  /**
   * Write any symbol in textarea
   * @param {*} symbol text symbol
   * @param {*} isCaps is caps released
   */
  writeSymbol(symbol, isCaps) {
    if (!symbol) {
      return;
    }
    this.textarea.focus();
    let cursorPosition = this.textarea.selectionStart;
    const leftText = this.textarea.value.slice(0, cursorPosition);
    const rightText = this.textarea.value.slice(cursorPosition);

    cursorPosition += 1;
    const symbolInRightRegister = isCaps ? symbol.toUpperCase() : symbol.toLowerCase();
    this.textarea.value = `${leftText}${symbolInRightRegister || ''}${rightText}`;
    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
  }

  /**
   * Write space in textarea
   */
  releaseSpace() {
    this.writeSymbol(' ');
  }

  /**
   * Write enter in textarea
   */
  releaseEnter() {
    this.writeSymbol('\n');
  }

  /**
   * Write tab in textarea
   */
  releaseTab() {
    this.writeSymbol('\t');
  }

  /**
   * Release backspace button and delete left element of text area cursor
   */
  releaseBackspace() {
    let cursorPosition = this.textarea.selectionStart;
    const leftText = this.textarea.value.substring(0, cursorPosition);
    const rightText = this.textarea.value.slice(cursorPosition);

    cursorPosition = cursorPosition - 1 > 0 ? cursorPosition - 1 : 0;
    this.textarea.value = `${leftText.slice(0, -1)}${rightText}`;
    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
  }

  /**
   * Release delete button and delete right element of text area cursor
   */
  releaseDelete() {
    const cursorPosition = this.textarea.selectionStart;
    const leftText = this.textarea.value.substring(0, cursorPosition);
    const rightText = this.textarea.value.slice(cursorPosition);

    this.textarea.value = `${leftText}${rightText.slice(1)}`;
    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
  }

  /**
   * Release left arrow and move textarea cursor in the left
   */
  releaseLeftArrow() {
    let cursorPosition = this.textarea.selectionStart;
    cursorPosition = cursorPosition - 1 > 0 ? cursorPosition - 1 : 0;
    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
  }

  /**
   * Release right arrow and move textarea cursor in the left
   */
  releaseRightArrow() {
    let cursorPosition = this.textarea.selectionStart;
    cursorPosition = this.textarea.value.length >= cursorPosition + 1
      ? cursorPosition + 1
      : cursorPosition;

    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
  }
}
