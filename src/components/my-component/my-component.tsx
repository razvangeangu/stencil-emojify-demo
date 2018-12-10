import { Component, Prop, State } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.scss',
  shadow: true
})
export class MyComponent {
  @Prop() emojiText: string = 'cat';
  @Prop() emojiValue: string = '🐈';

  @State() textFormatted = [];

  private divInput: HTMLDivElement;
  private text: string;

  private onKeyUp(event) {
    this.divInput = event.target;
    this.text = event.target.innerText;
  }

  private onClickEmoji(event): void {
    const buttonElement = event.target as HTMLButtonElement;
    buttonElement.innerText = this.emojiValue;
  }

  private onEmojify(): void {
    // Create regex from emoji text prop
    let regexp = new RegExp(this.emojiText, 'gi');
    let match,
      matches = [];

    // Find all matches
    while ((match = regexp.exec(this.text)) != null) {
      matches.push(match.index);
    }

    // Replace matches with colored span
    let start = 0;
    let content = [];
    for (const match of matches) {
      content.push(this.text.substring(start, match));
      content.push(
        <button
          onClick={this.onClickEmoji.bind(this)}
          class="emoji-span"
          contenteditable="false"
        >
          {this.emojiText}
        </button>
      );
      start = match + this.emojiText.length;
    }

    // Push anything after the last match
    if (content && content.length > 0) {
      content.push(
        <span>
          {this.text.substring(
            matches[matches.length - 1] + this.emojiText.length,
            this.text.length
          )}
        </span>
      );

      // Clear de inner text and replace the formatted one
      this.divInput.innerText = '';
      this.textFormatted = content;
    }
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <div
          contentEditable
          onKeyUp={this.onKeyUp.bind(this)}
          class="div-input"
        >
          {this.textFormatted}
        </div>
        <button class="emojify-button" onClick={this.onEmojify.bind(this)}>
          Emojify
        </button>
      </div>
    );
  }
}
