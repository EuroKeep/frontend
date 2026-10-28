import {Pipe, PipeTransform} from '@angular/core';

/** I will lowercase the value and strip its accents, so "Króna" and "krona" compare equal. */
export function normalizeSearchText(value: string): string {
    return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/** I will split the search term into normalized words, e.g. "Benzin Mot" -> ["benzin", "mot"]. */
export function searchWords(term: string | null | undefined): string[] {
    return normalizeSearchText(term ?? '').split(/\s+/).filter(word => word.length > 0);
}

/** The normalized label plus, for every normalized character, the index of the original character it came from. */
interface NormalizedLabel {
    text: string;
    originalIndexOf: number[];
}

/**
 * Replacement for ngOptionHighlight: that directive caches the label's innerHTML once and
 * overwrites the DOM, so recycled option views (virtual scroll / filtering) keep showing a
 * stale label. This pipe recomputes the highlighted HTML from the actual label every time.
 * Every search word is highlighted on its own, ignoring case and accents.
 */
@Pipe({
    name: 'optionHighlight',
})
export class OptionHighlightPipe implements PipeTransform {

    /** I will return the escaped label as HTML, with every match of the search term wrapped in a highlight span. */
    transform(label: string | null | undefined, term: string | null | undefined): string {
        const characters = Array.from(label ?? '');
        const words = searchWords(term);

        const isHighlighted = this.findHighlightedCharacters(characters, words);
        return this.renderHtml(characters, isHighlighted);
    }

    /** I will return one flag per original character: true if it is part of a match for any search word. */
    private findHighlightedCharacters(characters: string[], words: string[]): boolean[] {
        const isHighlighted = new Array<boolean>(characters.length).fill(false);
        const normalizedLabel = this.normalizeLabel(characters);

        for (const word of words) {
            for (const matchStart of this.findAllMatches(normalizedLabel.text, word)) {
                for (let position = matchStart; position < matchStart + word.length; position++) {
                    isHighlighted[normalizedLabel.originalIndexOf[position]] = true;
                }
            }
        }
        return isHighlighted;
    }

    /**
     * I will normalize the label character by character. A single original character can become
     * several normalized characters, so I will remember where each one came from in order to map
     * matches in the normalized text back onto the original label.
     */
    private normalizeLabel(characters: string[]): NormalizedLabel {
        let text = '';
        const originalIndexOf: number[] = [];

        characters.forEach((character, originalIndex) => {
            const normalizedCharacter = normalizeSearchText(character);
            text += normalizedCharacter;
            for (let i = 0; i < normalizedCharacter.length; i++) {
                originalIndexOf.push(originalIndex);
            }
        });
        return {text, originalIndexOf};
    }

    /** I will return the start index of every non-overlapping occurrence of word in text. */
    private findAllMatches(text: string, word: string): number[] {
        const matchStarts: number[] = [];
        let index = text.indexOf(word);
        while (index !== -1) {
            matchStarts.push(index);
            index = text.indexOf(word, index + word.length);
        }
        return matchStarts;
    }

    /** I will escape the label and wrap every run of highlighted characters in a single span. */
    private renderHtml(characters: string[], isHighlighted: boolean[]): string {
        let html = '';
        let insideHighlight = false;

        characters.forEach((character, index) => {
            const highlightStarts = isHighlighted[index] && !insideHighlight;
            const highlightEnds = !isHighlighted[index] && insideHighlight;

            if (highlightStarts) {
                html += '<span class="highlighted">';
            } else if (highlightEnds) {
                html += '</span>';
            }
            insideHighlight = isHighlighted[index];
            html += this.escapeHtml(character);
        });

        if (insideHighlight) {
            html += '</span>';
        }
        return html;
    }

    /** I will escape the HTML special characters in the value, so the label cannot inject markup. */
    private escapeHtml(value: string): string {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
