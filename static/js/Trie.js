class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word) {
            const lowerChar = char.toLowerCase();
            if (!node.children.has(lowerChar)) {
                node.children.set(lowerChar, new TrieNode());
            }
            node = node.children.get(lowerChar);
        }
        node.isEndOfWord = true;
    }

    search(prefix) {
        let node = this.root;
        for (const char of prefix) {
            const lowerChar = char.toLowerCase();
            if (!node.children.has(lowerChar)) {
                return [];
            }
            node = node.children.get(lowerChar);
        }
        return this._findAllWords(node, prefix);
    }

    _findAllWords(node, word) {
        const results = [];
        if (node.isEndOfWord) {
            results.push(word);
        }
        for (const [char, child] of node.children) {
            results.push(...this._findAllWords(child, word + char));
        }
        return results;
    }
}
