import React, { useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    ListNode,
    ListItemNode,
} from '@lexical/list';
import {
    $createHeadingNode,
    HeadingNode,
    QuoteNode,
} from '@lexical/rich-text';
import { ParagraphNode } from 'lexical';

// --- Configuration Data ---
const FONT_FAMILY_OPTIONS = [
    ['Default (Arial)', 'Arial'],
    ['Courier New', 'Courier New'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
];

const FONT_SIZE_OPTIONS = [
    ['Small (12px)', '12px'],
    ['Normal (16px)', '16px'],
    ['Large (20px)', '20px'],
    ['Huge (24px)', '24px'],
];

// --- Styles for the editor (These are inline styles for the container) ---
// Note: We remove font-size/color/etc. from here, letting the CSS control those,
// but keep the structural styles (border/padding/minHeight).
const editorStyle = {
    minHeight: '150px',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: 'white',
};

// --- Initial Config & Nodes ---
const initialConfig = {
    namespace: 'GameDescriptionEditor',
    theme: {
        text: {
            bold: 'font-bold',
            italic: 'italic',
            underline: 'underline',
        },
    },
    onError: (error) => {
        console.error(error);
    },
    nodes: [
        ParagraphNode,
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
    ],
};

// --- Helper function for list commands ---
const insertList = (listType, editor) => {
    if (listType === 'ul') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (listType === 'ol') {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
};

// --- New Toolbar Component (Full Controls) ---
const ToolbarPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const [activeEditor] = useState(editor);
    const [fontSize, setFontSize] = useState('16px'); 
    const [fontFamily, setFontFamily] = useState('Arial');

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                activeEditor.getEditorState().read(() => {
                    const selection = $getSelection();
                    if (!$isRangeSelection(selection)) {
                        return;
                    }
                });
            },
            0,
        );
    }, [activeEditor, editor]);

    const formatText = (format) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    const setAlignment = (alignment) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
    };

    const setBlockType = (blockType) => {
        if (blockType === 'h2') {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    selection.getNodes().forEach((node) => {
                        node.insertNewAfter($createHeadingNode('h2'));
                        node.remove();
                    });
                }
            });
        }
    };

    // The key styling function is correct.
    const applyStyleText = (style, value) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                selection.setStyle(`${style}: ${value}`); 
            }
        });
    };

    const onFontSizeSelect = (e) => {
        const size = e.target.value;
        setFontSize(size);
        applyStyleText('font-size', size);
    };

    const onFontFamilySelect = (e) => {
        const family = e.target.value;
        setFontFamily(family);
        applyStyleText('font-family', family);
    };

    return (
        <div className="toolbar p-2 border border-gray-300 bg-gray-50 rounded-t-md flex flex-wrap gap-2 items-center">

            {/* Font Size Control */}
            <select onChange={onFontSizeSelect} value={fontSize} className="p-1 border rounded text-black bg-white">
                {FONT_SIZE_OPTIONS.map(([text, value]) => (
                    <option key={value} value={value}>{text}</option>
                ))}
            </select>

            {/* Font Family Control */}
            <select onChange={onFontFamilySelect} value={fontFamily} className="p-1 border rounded text-black bg-white">
                {FONT_FAMILY_OPTIONS.map(([text, value]) => (
                    <option key={value} value={value}>{text}</option>
                ))}
            </select>

            <div className="border-l border-gray-300 mx-1 h-6 self-center"></div>

            {/* Text Formatting Controls */}
            <button onClick={() => formatText('bold')} className="px-2 py-1 rounded hover:bg-gray-200 font-bold text-black" type="button">
                B
            </button>
            <button onClick={() => formatText('italic')} className="px-2 py-1 rounded hover:bg-gray-200 italic text-black" type="button">
                I
            </button>
            <button onClick={() => formatText('underline')} className="px-2 py-1 rounded hover:bg-gray-200 underline text-black" type="button">
                U
            </button>

            <div className="border-l border-gray-300 mx-1 h-6 self-center"></div>

            {/* List Controls */}
            <button onClick={() => insertList('ul', editor)} className="px-2 py-1 rounded hover:bg-gray-200 text-black" type="button">
                • List
            </button>
            <button onClick={() => insertList('ol', editor)} className="px-2 py-1 rounded hover:bg-gray-200 text-black" type="button">
                1. List
            </button>

            <div className="border-l border-gray-300 mx-1 h-6 self-center"></div>

            {/* Alignment Controls */}
            <button onClick={() => setAlignment('left')} className="px-2 py-1 rounded hover:bg-gray-200 text-black" type="button">
                Left
            </button>
            <button onClick={() => setAlignment('center')} className="px-2 py-1 rounded hover:bg-gray-200 text-black" type="button">
                Center
            </button>
            <button onClick={() => setAlignment('right')} className="px-2 py-1 rounded hover:bg-gray-200 text-black" type="button">
                Right
            </button>

            <div className="border-l border-gray-300 mx-1 h-6 self-center"></div>

            {/* Heading Control */}
            <button onClick={() => setBlockType('h2')} className="px-2 py-1 rounded hover:bg-gray-200 font-semibold text-black" type="button">
                H2
            </button>

        </div>
    );
};

// --- The Main Editor Component ---
function GameDescriptionEditor({ onChange }) {

    const handleEditorChange = (editorState, editor) => {
        editorState.read(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            onChange(htmlString);
        });
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <ToolbarPlugin />
            <div className="editor-container border border-t-0 border-gray-300 rounded-b-md">
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            className="editor-input" 
                            style={editorStyle} // Structural styles only
                        />
                    }
                    placeholder={
                        <div
                            className="editor-placeholder"
                            style={{ position: 'absolute', top: '55px', left: '20px', color: '#999' }}
                        >
                            Write your blog post content...
                        </div>
                    }
                />
            </div>

            <HistoryPlugin />
            <OnChangePlugin onChange={handleEditorChange} />
        </LexicalComposer>
    );
}

export default GameDescriptionEditor;