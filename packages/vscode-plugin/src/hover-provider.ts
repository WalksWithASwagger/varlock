/*
  Hover help for known decorators and built-in resolver functions.
*/
import {
  type ExtensionContext, Hover, languages, MarkdownString,
} from 'vscode';
import { LANG_ID } from './constants';
import { resolveHoverContent } from './hover-core';
import { deindent } from './utils/deindent';

export function addHoverProvider(_context: ExtensionContext) {
  languages.registerHoverProvider(LANG_ID, {
    provideHover(document, position, _token) {
      const wordAtPos = document.getWordRangeAtPosition(position, /@?[A-Za-z][\w]*/);
      if (!wordAtPos) return undefined;

      const hoveredText = document.getText(wordAtPos);
      const content = resolveHoverContent(hoveredText);
      if (!content) return undefined;

      const kindLabel = content.kind === 'decorator' ? 'Decorator' : 'Resolver function';
      const mds = new MarkdownString();
      mds.supportThemeIcons = true;
      mds.appendMarkdown(deindent(`
        **${kindLabel}** \`${content.kind === 'decorator' ? `@${content.name}` : `${content.name}()`}\`

        ${content.summary}

        ${content.documentation}
      `));
      return new Hover(mds, wordAtPos);
    },
  });
}
